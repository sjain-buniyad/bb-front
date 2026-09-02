"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "@/lib/auth-context";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: any,
            callback?: (response: any) => void,
          ) => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  /** 自定义触发元素，不传则渲染默认按钮 */
  children?: React.ReactNode;
  className?: string;
  /** 登录成功后的回调 */
  onSuccess?: () => void;
  /** 登录失败的回调 */
  onError?: (error: string) => void;
}

export default function GoogleLoginButton({
  children,
  className = "",
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response: { credential?: string }) => {
      if (!response.credential) {
        onError?.("No credential received from Google");
        return;
      }

      setLoading(true);
      try {
        await googleLogin(response.credential);
        onSuccess?.();
      } catch (err: any) {
        onError?.(err.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    [googleLogin, onSuccess, onError],
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      return;
    }

    // 加载 Google Identity Services 脚本
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // 如果有自定义 children，不渲染 Google 默认按钮
      if (!children && buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: buttonRef.current.offsetWidth,
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    };

    document.head.appendChild(script);
  }, [children, handleCredentialResponse]);

  /** 自定义按钮点击时触发 Google 弹窗 */
  const handleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          onError?.("Google sign-in was not displayed");
        }
      });
    }
  };

  if (children) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-20"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            Connecting...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }

  return (
    <div
      ref={buttonRef}
      className={`w-full flex justify-center ${className}`}
    />
  );
}

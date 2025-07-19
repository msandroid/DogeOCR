import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      // ユーザーエージェントによる判定
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // 画面幅による判定
      const isMobileWidth = window.innerWidth < MOBILE_BREAKPOINT
      
      // タッチ機能の有無による判定
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // デバイスピクセル比による判定（高解像度デバイスはモバイルの可能性が高い）
      const isHighDPR = window.devicePixelRatio > 1
      
      // 複数の条件を組み合わせて判定
      const mobileScore = [
        isMobileUserAgent ? 3 : 0,
        isMobileWidth ? 2 : 0,
        hasTouchScreen ? 1 : 0,
        isHighDPR ? 1 : 0
      ].reduce((sum, score) => sum + score, 0)
      
      // スコアが3以上の場合をモバイルと判定
      setIsMobile(mobileScore >= 3)
    }

    checkMobile()
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = checkMobile
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// より詳細なデバイス情報を取得するフック
export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = React.useState<{
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    userAgent: string
    screenSize: { width: number; height: number }
    hasTouch: boolean
    devicePixelRatio: number
  } | undefined>(undefined)

  React.useEffect(() => {
    const getDeviceInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTabletUserAgent = /ipad|android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)
      const isMobileWidth = window.innerWidth < MOBILE_BREAKPOINT
      const isTabletWidth = window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      const mobileScore = [
        isMobileUserAgent ? 3 : 0,
        isMobileWidth ? 2 : 0,
        hasTouchScreen ? 1 : 0,
        window.devicePixelRatio > 1 ? 1 : 0
      ].reduce((sum, score) => sum + score, 0)
      
      const isMobile = mobileScore >= 3
      const isTablet = isTabletUserAgent || (isTabletWidth && hasTouchScreen)
      const isDesktop = !isMobile && !isTablet

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        userAgent: navigator.userAgent,
        screenSize: { width: window.innerWidth, height: window.innerHeight },
        hasTouch: hasTouchScreen,
        devicePixelRatio: window.devicePixelRatio
      })
    }

    getDeviceInfo()
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = getDeviceInfo
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return deviceInfo
}

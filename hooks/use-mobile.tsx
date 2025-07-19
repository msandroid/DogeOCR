import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Safari検出関数
const isSafari = () => {
  if (typeof navigator === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  return /safari/.test(userAgent) && !/chrome/.test(userAgent)
}

// iOS Safari検出関数
const isIOSSafari = () => {
  if (typeof navigator === 'undefined') return false
  
  const userAgent = navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) && !/chrome/.test(userAgent)
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isSafariBrowser, setIsSafariBrowser] = React.useState(false)
  const [isIOSSafariBrowser, setIsIOSSafariBrowser] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      try {
        // Safari検出
        const safari = isSafari()
        const iosSafari = isIOSSafari()
        setIsSafariBrowser(safari)
        setIsIOSSafariBrowser(iosSafari)

        // ユーザーエージェントによる判定
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
        
        // 画面幅による判定（Safariではより慎重に）
        const isMobileWidth = window.innerWidth < MOBILE_BREAKPOINT
        
        // タッチ機能の有無による判定
        const hasTouchScreen = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
        
        // デバイスピクセル比による判定
        const isHighDPR = window.devicePixelRatio > 1
        
        // Safari固有の判定ロジック
        if (safari) {
          // Safariの場合はより慎重に判定
          const mobileScore = [
            isMobileUserAgent ? 2 : 0,
            isMobileWidth ? 3 : 0,
            hasTouchScreen ? 2 : 0,
            isHighDPR ? 1 : 0
          ].reduce((sum, score) => sum + score, 0)
          
          // Safariではスコアが4以上の場合をモバイルと判定
          setIsMobile(mobileScore >= 4)
        } else {
          // 通常のブラウザの判定
          const mobileScore = [
            isMobileUserAgent ? 3 : 0,
            isMobileWidth ? 2 : 0,
            hasTouchScreen ? 1 : 0,
            isHighDPR ? 1 : 0
          ].reduce((sum, score) => sum + score, 0)
          
          // スコアが3以上の場合をモバイルと判定
          setIsMobile(mobileScore >= 3)
        }
      } catch (error) {
        console.warn('デバイス判定でエラーが発生しました:', error)
        // エラーが発生した場合はフォールバック
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    }

    checkMobile()
    
    // Safariの場合はより頻繁にチェック
    const checkInterval = isSafari() ? 1000 : 5000
    
    const interval = setInterval(checkMobile, checkInterval)
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = checkMobile
    mql.addEventListener("change", onChange)
    
    return () => {
      clearInterval(interval)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}

// より詳細なデバイス情報を取得するフック
export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = React.useState<{
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isSafari: boolean
    isIOSSafari: boolean
    userAgent: string
    screenSize: { width: number; height: number }
    hasTouch: boolean
    devicePixelRatio: number
  } | undefined>(undefined)

  React.useEffect(() => {
    const getDeviceInfo = () => {
      try {
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
        const isTabletUserAgent = /ipad|android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)
        const isMobileWidth = window.innerWidth < MOBILE_BREAKPOINT
        const isTabletWidth = window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024
        const hasTouchScreen = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
        
        const safari = isSafari()
        const iosSafari = isIOSSafari()
        
        // Safari固有の判定ロジック
        let mobileScore
        if (safari) {
          mobileScore = [
            isMobileUserAgent ? 2 : 0,
            isMobileWidth ? 3 : 0,
            hasTouchScreen ? 2 : 0,
            window.devicePixelRatio > 1 ? 1 : 0
          ].reduce((sum, score) => sum + score, 0)
        } else {
          mobileScore = [
            isMobileUserAgent ? 3 : 0,
            isMobileWidth ? 2 : 0,
            hasTouchScreen ? 1 : 0,
            window.devicePixelRatio > 1 ? 1 : 0
          ].reduce((sum, score) => sum + score, 0)
        }
        
        const isMobile = safari ? mobileScore >= 4 : mobileScore >= 3
        const isTablet = isTabletUserAgent || (isTabletWidth && hasTouchScreen)
        const isDesktop = !isMobile && !isTablet

        setDeviceInfo({
          isMobile,
          isTablet,
          isDesktop,
          isSafari: safari,
          isIOSSafari: iosSafari,
          userAgent: navigator.userAgent,
          screenSize: { width: window.innerWidth, height: window.innerHeight },
          hasTouch: hasTouchScreen,
          devicePixelRatio: window.devicePixelRatio
        })
      } catch (error) {
        console.warn('デバイス情報の取得でエラーが発生しました:', error)
        // エラーが発生した場合はフォールバック
        setDeviceInfo({
          isMobile: window.innerWidth < MOBILE_BREAKPOINT,
          isTablet: false,
          isDesktop: window.innerWidth >= MOBILE_BREAKPOINT,
          isSafari: isSafari(),
          isIOSSafari: isIOSSafari(),
          userAgent: navigator.userAgent,
          screenSize: { width: window.innerWidth, height: window.innerHeight },
          hasTouch: 'ontouchstart' in window,
          devicePixelRatio: window.devicePixelRatio
        })
      }
    }

    getDeviceInfo()
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = getDeviceInfo
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return deviceInfo
}

// Safari専用のフック
export function useSafariInfo() {
  const [safariInfo, setSafariInfo] = React.useState<{
    isSafari: boolean
    isIOSSafari: boolean
    version: string
    supportsCamera: boolean
    supportsTouch: boolean
  } | undefined>(undefined)

  React.useEffect(() => {
    const getSafariInfo = () => {
      try {
        const safari = isSafari()
        const iosSafari = isIOSSafari()
        
        // Safariバージョン取得
        let version = "unknown"
        if (safari) {
          const userAgent = navigator.userAgent
          const versionMatch = userAgent.match(/Version\/(\d+\.\d+)/)
          if (versionMatch) {
            version = versionMatch[1]
          }
        }
        
        // カメラサポート確認
        const supportsCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        
        // タッチサポート確認
        const supportsTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
        
        setSafariInfo({
          isSafari: safari,
          isIOSSafari: iosSafari,
          version,
          supportsCamera,
          supportsTouch
        })
      } catch (error) {
        console.warn('Safari情報の取得でエラーが発生しました:', error)
        setSafariInfo({
          isSafari: isSafari(),
          isIOSSafari: isIOSSafari(),
          version: "unknown",
          supportsCamera: false,
          supportsTouch: false
        })
      }
    }

    getSafariInfo()
  }, [])

  return safariInfo
}

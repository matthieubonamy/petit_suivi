import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { colors } from '../../constants/tokens';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'ps_install_dismissed';

export function InstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Already dismissed permanently
    try {
      if (localStorage.getItem(DISMISSED_KEY) === '1') return;
    } catch {}

    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Detect iOS Safari (no beforeinstallprompt, must show manual instructions)
    const ua = navigator.userAgent;
    const isIOSSafari = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;

    if (isIOSSafari) {
      setIsIOS(true);
      setVisible(true);
      show();
      return;
    }

    // Android / Chrome: wait for the browser install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
      show();
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function show() {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }

  function hide(permanent = false) {
    Animated.timing(slideAnim, {
      toValue: 120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
    if (permanent) {
      try { localStorage.setItem(DISMISSED_KEY, '1'); } catch {}
    }
  }

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') hide(true);
    else hide(false);
  }

  if (!visible) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.row}>
        <Text style={styles.icon}>📲</Text>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Installer l'application</Text>
          {isIOS ? (
            <Text style={styles.subtitle}>
              Appuyez sur{' '}
              <Text style={styles.bold}>Partager</Text>
              {' '}puis{' '}
              <Text style={styles.bold}>Sur l'écran d'accueil</Text>
            </Text>
          ) : (
            <Text style={styles.subtitle}>Accès rapide depuis votre écran d'accueil</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => hide(true)} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
      {!isIOS && prompt && (
        <TouchableOpacity style={styles.installBtn} onPress={handleInstall} activeOpacity={0.85}>
          <Text style={styles.installBtnText}>Installer</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.sur,
    borderTopWidth: 1,
    borderTopColor: colors.bdr,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { fontSize: 28 },
  textBlock: { flex: 1 },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: colors.dk,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.mu,
    lineHeight: 18,
  },
  bold: {
    fontFamily: 'Nunito_700Bold',
    color: colors.dk,
  },
  closeBtn: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: colors.mu,
    fontFamily: 'Nunito_400Regular',
  },
  installBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  installBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#fff',
  },
});

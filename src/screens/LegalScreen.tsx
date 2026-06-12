import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../constants/tokens';
import { RootStackParamList } from '../types';

type LegalRoute = RouteProp<RootStackParamList, 'Legal'>;

type Tab = 'cgv' | 'rgpd' | 'mentions';

const TAB_LABELS: Record<Tab, string> = {
  cgv: 'CGV',
  rgpd: 'RGPD',
  mentions: 'Mentions',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.legalSection}>
      <Text style={styles.legalSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <Text style={styles.legalText}>{children}</Text>;
}

function CGVContent() {
  return (
    <>
      <Section title="Objet">
        <Para>
          Les présentes conditions générales de vente régissent l'utilisation de l'application
          Petit Suivi, un outil de suivi de la santé digestive des nourrissons et enfants de 0 à 6 ans.
        </Para>
      </Section>
      <Section title="Compte utilisateur">
        <Para>
          La création d'un compte est optionnelle. Sans compte, les données restent sur l'appareil.
          Avec un compte Supabase, certaines fonctionnalités de synchronisation peuvent être activées.
          L'utilisateur est responsable de la confidentialité de ses identifiants.
        </Para>
      </Section>
      <Section title="Données de suivi">
        <Para>
          Les données de suivi (observations, photos) sont stockées localement sur l'appareil par défaut.
          L'application ne collecte pas ni ne transmet ces données à des serveurs tiers sans consentement explicite.
        </Para>
      </Section>
      <Section title="Responsabilité">
        <Para>
          Petit Suivi est un outil d'aide au suivi et ne constitue pas un dispositif médical.
          Les informations fournies ne remplacent pas l'avis d'un professionnel de santé.
          L'éditeur décline toute responsabilité en cas d'usage médical de l'application.
        </Para>
      </Section>
      <Section title="Modifications">
        <Para>
          L'éditeur se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs
          seront informés de toute modification substantielle lors de l'ouverture de l'application.
        </Para>
      </Section>
      <Para>Dernière mise à jour : juin 2025</Para>
    </>
  );
}

function RGPDContent() {
  return (
    <>
      <Section title="Données collectées">
        <Para>
          Petit Suivi collecte uniquement les données nécessaires au fonctionnement du service :
          adresse email (si compte créé), observations de santé saisies manuellement, et photos
          optionnelles associées aux observations. Toutes ces données sont stockées localement.
        </Para>
      </Section>
      <Section title="Base légale">
        <Para>
          Le traitement des données repose sur votre consentement explicite lors de la création
          du compte ou de la saisie des données. Vous pouvez retirer ce consentement à tout moment
          en supprimant vos données depuis l'application.
        </Para>
      </Section>
      <Section title="Durée de conservation">
        <Para>
          Les données sont conservées localement jusqu'à leur suppression par l'utilisateur.
          En cas de suppression du compte, les données d'authentification sont supprimées de
          nos serveurs dans un délai de 30 jours.
        </Para>
      </Section>
      <Section title="Vos droits">
        <Para>
          Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement,
          de portabilité et d'opposition. Pour exercer ces droits, contactez notre DPO :
          dpo@petitsuivi.fr
        </Para>
      </Section>
      <Section title="Cookies">
        <Para>
          L'application n'utilise pas de cookies de traçage. Seul le stockage local de l'appareil
          est utilisé pour la persistance des sessions et des données.
        </Para>
      </Section>
      <Para>Contact DPO : dpo@petitsuivi.fr</Para>
    </>
  );
}

function MentionsContent() {
  return (
    <>
      <Section title="Éditeur">
        <Para>
          Petit Suivi{'\n'}
          Application mobile de suivi pédiatrique{'\n'}
          Contact : contact@petitsuivi.fr
        </Para>
      </Section>
      <Section title="Directeur de publication">
        <Para>
          Le directeur de publication est le représentant légal de l'éditeur de l'application.
        </Para>
      </Section>
      <Section title="Hébergement">
        <Para>
          Les données d'authentification sont hébergées par Supabase Inc.{'\n'}
          970 Toa Payoh North, Singapour.{'\n'}
          Les données de suivi sont stockées uniquement sur l'appareil de l'utilisateur.
        </Para>
      </Section>
      <Section title="Propriété intellectuelle">
        <Para>
          L'ensemble des contenus de l'application (textes, graphismes, logo, icônes) est protégé
          par le droit d'auteur. Toute reproduction sans autorisation est interdite.
        </Para>
      </Section>
      <Para>Contact : contact@petitsuivi.fr</Para>
    </>
  );
}

const CONTENT: Record<Tab, React.ReactElement> = {
  cgv: <CGVContent />,
  rgpd: <RGPDContent />,
  mentions: <MentionsContent />,
};

export function LegalScreen() {
  const navigation = useNavigation();
  const route = useRoute<LegalRoute>();
  const [activeTab, setActiveTab] = useState<Tab>(route.params?.tab ?? 'cgv');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Informations légales</Text>
      </View>

      <View style={styles.tabs}>
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeTab === t && styles.tabActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
              {TAB_LABELS[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {CONTENT[activeTab]}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, paddingBottom: 12 },
  backBtn: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', marginBottom: 4 },
  backText: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.primary },
  heading: { fontFamily: 'Fraunces_600SemiBold', fontSize: 26, color: colors.dk },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.sur,
    borderWidth: 1,
    borderColor: colors.bdr,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.mu },
  tabTextActive: { color: '#fff' },
  content: { padding: 20, paddingBottom: 48, gap: 4 },
  legalSection: { marginBottom: 20 },
  legalSectionTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    color: colors.dk,
    marginBottom: 8,
  },
  legalText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: colors.mu,
    lineHeight: 22,
  },
});

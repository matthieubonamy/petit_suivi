import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../constants/tokens';
import { RootStackParamList } from '../types';

type LegalRoute = RouteProp<RootStackParamList, 'Legal'>;

type Tab = 'cgv' | 'rgpd' | 'mentions';

const TAB_LABELS: Record<Tab, string> = {
  cgv: 'CGU',
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
      <Para>
        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
        de l'application mobile Petit Suivi, disponible sur navigateur web (Progressive Web App).
        En utilisant l'application, vous acceptez sans réserve les présentes CGU.
      </Para>

      <Section title="1. Objet de l'application">
        <Para>
          Petit Suivi est une application gratuite d'aide au suivi de la santé digestive des
          nourrissons et jeunes enfants (0 à 6 ans). Elle permet aux parents et aidants d'observer
          et d'enregistrer les selles et urines de l'enfant, avec des repères de couleur et de
          consistance issus de la littérature pédiatrique.
        </Para>
      </Section>

      <Section title="2. Accès et inscription">
        <Para>
          L'application est accessible gratuitement sans création de compte. La création d'un compte
          (adresse email + mot de passe) est optionnelle et permet une future synchronisation des
          données. L'utilisateur est seul responsable de la confidentialité de ses identifiants.
          Toute utilisation frauduleuse du compte engage la responsabilité de l'utilisateur.
        </Para>
      </Section>

      <Section title="3. Données de santé et stockage local">
        <Para>
          Toutes les données de suivi saisies (observations, photos, notes) sont stockées
          exclusivement sur l'appareil de l'utilisateur via le stockage local du navigateur
          (localStorage). Ces données ne sont ni transmises, ni hébergées sur un serveur distant,
          ni accessibles à l'éditeur. L'utilisateur en conserve le contrôle total et peut les
          supprimer à tout moment en effaçant les données de navigation.
        </Para>
      </Section>

      <Section title="4. Avertissement médical">
        <Para>
          Petit Suivi est un outil d'aide au suivi et d'information générale. Il ne constitue
          pas un dispositif médical au sens de la réglementation européenne (règlement UE 2017/745).
          Les informations et repères fournis ne remplacent en aucun cas l'avis, le diagnostic
          ou le traitement d'un professionnel de santé (pédiatre, médecin généraliste, sage-femme).{'\n\n'}
          En cas de doute, de symptôme inhabituel ou de situation d'urgence, consultez
          immédiatement un professionnel de santé ou appelez le 15 (SAMU).
        </Para>
      </Section>

      <Section title="5. Propriété intellectuelle">
        <Para>
          L'ensemble des éléments de l'application (code source, design, textes, illustrations,
          logo) est protégé par le droit d'auteur. Toute reproduction, représentation, modification
          ou exploitation sans autorisation écrite préalable de l'éditeur est strictement interdite.
        </Para>
      </Section>

      <Section title="6. Limitation de responsabilité">
        <Para>
          L'éditeur s'efforce d'assurer la disponibilité et l'exactitude des informations
          contenues dans l'application mais ne garantit pas leur exhaustivité. L'éditeur ne
          saurait être tenu responsable de tout dommage direct ou indirect résultant de
          l'utilisation ou de l'impossibilité d'utiliser l'application, notamment en cas de
          perte de données locales liée à la suppression du cache du navigateur.
        </Para>
      </Section>

      <Section title="7. Modifications des CGU">
        <Para>
          L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. La version
          en vigueur est accessible dans l'application. La poursuite de l'utilisation après
          modification vaut acceptation des nouvelles conditions.
        </Para>
      </Section>

      <Section title="8. Droit applicable">
        <Para>
          Les présentes CGU sont soumises au droit français. En cas de litige, les parties
          rechercheront une solution amiable avant tout recours judiciaire. À défaut, les
          tribunaux français seront seuls compétents.
        </Para>
      </Section>

      <Para>Dernière mise à jour : juin 2026</Para>
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
          Petit Suivi — Application de suivi pédiatrique{'\n'}
          Éditeur : particulier (personne physique){'\n'}
          France{'\n'}
          Contact : contact@petitsuivi.fr
        </Para>
      </Section>
      <Section title="Directeur de publication">
        <Para>
          Le directeur de publication est l'éditeur de l'application, personne physique dont
          les coordonnées complètes sont communiquées sur demande à l'adresse{' '}
          contact@petitsuivi.fr, conformément à l'article 6-I de la loi n° 2004-575
          du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
        </Para>
      </Section>
      <Section title="Hébergement de l'application">
        <Para>
          L'application est hébergée sur GitHub Pages{'\n'}
          GitHub, Inc. — 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis{'\n'}
          https://pages.github.com
        </Para>
      </Section>
      <Section title="Hébergement de l'authentification">
        <Para>
          Les données d'authentification (email, mot de passe chiffré) sont hébergées par{'\n'}
          Supabase Inc. — 970 Toa Payoh North, Singapour{'\n'}
          https://supabase.com — conforme RGPD
        </Para>
      </Section>
      <Section title="Données de santé">
        <Para>
          Les données de suivi (observations, photos, notes) sont stockées exclusivement
          sur l'appareil de l'utilisateur. L'éditeur n'y a aucun accès.
        </Para>
      </Section>
      <Section title="Propriété intellectuelle">
        <Para>
          L'ensemble des contenus (code, design, textes, illustrations, logo) est la propriété
          de l'éditeur et protégé par le droit d'auteur français. Toute reproduction ou
          utilisation sans autorisation préalable écrite est interdite.
        </Para>
      </Section>
      <Para>Dernière mise à jour : juin 2026</Para>
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

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { CosmicLoader } from '../components/CosmicLoader';
import { CosmicBackground } from '../components/CosmicBackground';
import { LanguageToggle } from '../components/LanguageToggle';
import { BirthChartScreen } from '../screens/BirthChartScreen';
import { DailyReadingScreen } from '../screens/DailyReadingScreen';
import { EclipseScreen } from '../screens/EclipseScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MeaningsScreen } from '../screens/MeaningsScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PlanetsScreen } from '../screens/PlanetsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SkyMapScreen } from '../screens/SkyMapScreen';
import { WisdomScreen } from '../screens/WisdomScreen';
import { useI18n } from '../i18n';
import { useStore } from '../store/useStore';
import { colors } from '../theme';

const Root = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabMark({
  kind,
  focused,
}: {
  kind: 'home' | 'chart' | 'reading' | 'planets' | 'more';
  focused: boolean;
}) {
  const c = focused ? colors.gold : colors.muted;
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      {kind === 'home' ? (
        <>
          <Circle cx="11" cy="11" r="6.5" fill="none" stroke={c} strokeWidth="1.4" />
          <Circle cx="11" cy="11" r="1.6" fill={c} />
        </>
      ) : null}
      {kind === 'chart' ? (
        <>
          <Circle cx="11" cy="11" r="8" fill="none" stroke={c} strokeWidth="1.4" />
          <Circle cx="11" cy="11" r="4.2" fill="none" stroke={c} strokeWidth="1.2" />
        </>
      ) : null}
      {kind === 'reading' ? (
        <>
          <Line x1="5" y1="7" x2="17" y2="7" stroke={c} strokeWidth="1.4" />
          <Line x1="5" y1="11" x2="17" y2="11" stroke={c} strokeWidth="1.4" />
          <Line x1="5" y1="15" x2="13" y2="15" stroke={c} strokeWidth="1.4" />
        </>
      ) : null}
      {kind === 'planets' ? (
        <>
          <Circle cx="11" cy="11" r="3.2" fill="none" stroke={c} strokeWidth="1.4" />
          <Circle cx="11" cy="11" r="8" fill="none" stroke={c} strokeWidth="1.2" />
          <Circle cx="18" cy="8" r="1.5" fill={c} />
        </>
      ) : null}
      {kind === 'more' ? (
        <>
          <Rect x="5" y="5" width="4" height="4" fill="none" stroke={c} strokeWidth="1.3" />
          <Rect x="13" y="5" width="4" height="4" fill="none" stroke={c} strokeWidth="1.3" />
          <Rect x="5" y="13" width="4" height="4" fill="none" stroke={c} strokeWidth="1.3" />
          <Rect x="13" y="13" width="4" height="4" fill="none" stroke={c} strokeWidth="1.3" />
        </>
      ) : null}
    </Svg>
  );
}

function stackHeader(title: string) {
  return {
    headerShown: true,
    title,
    headerStyle: { backgroundColor: colors.night },
    headerTintColor: colors.gold,
    headerRight: () => (
      <View style={{ paddingRight: 8 }}>
        <LanguageToggle />
      </View>
    ),
    headerTitleStyle: { fontFamily: 'Georgia', fontSize: 18 },
  };
}

function MainTabs() {
  const { copy } = useI18n();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.night,
          borderTopColor: colors.cardBorder,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, letterSpacing: 0.4 },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: copy.tabs.today,
          tabBarIcon: ({ focused }) => <TabMark kind="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Chart"
        component={BirthChartScreen}
        options={{
          tabBarLabel: copy.tabs.chart,
          tabBarIcon: ({ focused }) => <TabMark kind="chart" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Reading"
        component={DailyReadingScreen}
        options={{
          tabBarLabel: copy.tabs.reading,
          tabBarIcon: ({ focused }) => <TabMark kind="reading" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Planets"
        component={PlanetsScreen}
        options={{
          tabBarLabel: copy.tabs.planets,
          tabBarIcon: ({ focused }) => <TabMark kind="planets" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: copy.tabs.more,
          tabBarIcon: ({ focused }) => <TabMark kind="more" focused={focused} />,
        }}
      />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const hydrated = useStore((s) => s.hydrated);
  const profile = useStore((s) => s.profile);
  const { copy } = useI18n();

  if (!hydrated) {
    return (
      <CosmicBackground>
        <CosmicLoader label={copy.loader} />
      </CosmicBackground>
    );
  }

  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.night,
          card: colors.night,
          text: colors.cream,
          primary: colors.gold,
        },
      }}
    >
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {profile?.onboardingComplete ? (
          <>
            <Root.Screen name="Main" component={MainTabs} />
            <Root.Screen name="SkyMap" component={SkyMapScreen} options={stackHeader(copy.stack.sky)} />
            <Root.Screen name="Eclipse" component={EclipseScreen} options={stackHeader(copy.stack.eclipse)} />
            <Root.Screen name="Wisdom" component={WisdomScreen} options={stackHeader(copy.stack.wisdom)} />
            <Root.Screen name="Meanings" component={MeaningsScreen} options={stackHeader(copy.stack.meanings)} />
            <Root.Screen name="Profile" component={ProfileScreen} options={stackHeader(copy.stack.profile)} />
          </>
        ) : (
          <Root.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}

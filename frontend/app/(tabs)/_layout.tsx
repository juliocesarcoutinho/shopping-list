import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🔍</Text>,
        }}
      />
      <Tabs.Screen
        name='playground'
        options={{
          title: 'Playground',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🎮</Text>,
        }}
      />
    </Tabs>
  );
}

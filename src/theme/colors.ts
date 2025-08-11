import { MantineColorsTuple } from '@mantine/core';

// Custom color palette for e-commerce based on your brand colors
export const customColors = {
  // Primary brand color - Based on your palette #1A2A80, #3B38A0, #7A85C1, #B2B0E8
  brand: [
    '#f5f6fd',    // Lightest - for backgrounds
    '#e8eaf9',    // Very light - for subtle backgrounds
    '#d4d8f3',    // Light - for disabled states
    '#B2B0E8',    // Your light purple
    '#9a96dd',    // Medium light
    '#7A85C1',    // Your medium purple
    '#5a5fb0',    // Medium
    '#3B38A0',    // Your medium dark purple
    '#2a2d85',    // Dark
    '#1A2A80'     // Your darkest purple - primary brand
  ] as MantineColorsTuple,
  
  // Secondary color - Complementary orange/amber for contrast with purple
  secondary: [
    '#fff9f0',    // Lightest
    '#ffedcc',    // Very light
    '#ffd699',    // Light
    '#ffbf66',    // Medium light
    '#ffa833',    // Medium
    '#ff9000',    // Primary secondary
    '#e6800a',    // Medium dark
    '#cc7014',    // Dark
    '#b3601e',    // Darker
    '#995028'     // Darkest
  ] as MantineColorsTuple,
  
  // Success color - Green that works with your purple theme
  success: [
    '#f0fff4',
    '#d4ffda',
    '#a8ffb8',
    '#7cff96',
    '#50ff74',
    '#24ff52',
    '#1ae642',
    '#10cc32',
    '#06b322',
    '#009912'
  ] as MantineColorsTuple,
  
  // Warning color - Amber/yellow that complements your palette
  warning: [
    '#fffef0',
    '#fffbd4',
    '#fff5a8',
    '#ffef7c',
    '#ffe950',
    '#ffe324',    // Primary warning
    '#e6ca1a',
    '#ccb010',
    '#b39706',
    '#997d00'
  ] as MantineColorsTuple,
  
  // Error/Danger color - Red with good contrast
  danger: [
    '#fff0f0',
    '#ffd9d9',
    '#ffb3b3',
    '#ff8080',
    '#ff5454',
    '#ff2828',    // Primary danger
    '#e61e1e',
    '#cc1414',
    '#b30a0a',
    '#990000'
  ] as MantineColorsTuple,
  
  // Neutral grays - Adjusted to work better with your purple theme
  neutral: [
    '#fafbfc',    // Almost white
    '#f4f5f7',    // Very light gray
    '#e9ecef',    // Light gray
    '#d6dae0',    // Medium light gray
    '#b8bcc8',    // Medium gray
    '#9ba1ac',    // Medium dark gray
    '#7d848f',    // Dark gray
    '#5f6673',    // Darker gray
    '#424856',    // Very dark gray
    '#252a39'     // Almost black
  ] as MantineColorsTuple,

  // Dark mode variants for better contrast
  darkBrand: [
    '#252a39',    // Dark background
    '#2a3047',    // Slightly lighter dark
    '#303755',    // Medium dark
    '#363e63',    // 
    '#3c4571',    // 
    '#424c7f',    // 
    '#48538d',    // 
    '#4e5a9b',    // 
    '#5461a9',    // 
    '#5a68b7'     // Lightest for dark mode
  ] as MantineColorsTuple,
};

// Helper function to get color values
export const getColor = (colorName: keyof typeof customColors, shade: number = 6) => {
  return customColors[colorName][shade];
};

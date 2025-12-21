
import React from 'react';
import { CardType, Intensity, Difficulty } from './types';

export const CARD_STYLES = {
  [CardType.TRUTH]: {
    color: 'bg-emerald-500',
    icon: '💬',
    gradient: 'from-emerald-600 to-teal-700',
    shadow: 'shadow-emerald-500/50'
  },
  [CardType.DARE]: {
    color: 'bg-rose-500',
    icon: '⚡',
    gradient: 'from-rose-600 to-red-700',
    shadow: 'shadow-rose-500/50'
  },
  [CardType.SECRET]: {
    color: 'bg-sky-500',
    icon: '🤫',
    gradient: 'from-sky-600 to-blue-700',
    shadow: 'shadow-sky-500/50'
  },
  [CardType.CHAOS]: {
    color: 'bg-violet-500',
    icon: '🌀',
    gradient: 'from-violet-600 to-purple-700',
    shadow: 'shadow-violet-500/50'
  }
};

export const FALLBACK_CARDS = {
  [Difficulty.EASY]: {
    [Intensity.CASUAL]: {
      [CardType.TRUTH]: ["What's your favorite food?", "Do you have a nickname?", "Which player has the best hair?"],
      [CardType.DARE]: ["Stand on one leg for 10 seconds.", "Make a funny face.", "Give the person to your left a high-five."],
      [CardType.SECRET]: ["Try to touch your nose with your tongue.", "Wink at the person to your right."],
      [CardType.CHAOS]: ["Everyone switch seats with someone else.", "The next player must bark like a dog."]
    },
    [Intensity.BOLD]: {
      [CardType.TRUTH]: ["What's the most childish thing you still do?", "Who is your favorite person in this room?", "What's a song you're ashamed of liking?"],
      [CardType.DARE]: ["Do 5 pushups.", "Spin around 5 times and try to walk straight.", "Let someone style your hair for a minute."],
      [CardType.SECRET]: ["Speak in a whisper for your next two turns.", "Try to make someone laugh without touching them."],
      [CardType.CHAOS]: ["Reverse the turn order.", "Everyone must keep a straight face for 1 minute."]
    },
    [Intensity.EXTREME]: {
      [CardType.TRUTH]: ["What's the most money you've ever spent on a single item?", "What is one thing you would change about yourself?", "Who here would you trust with your life?"],
      [CardType.DARE]: ["Let someone post a random emoji on your social media.", "Hold your breath for 30 seconds.", "Try to do a handstand against a wall."],
      [CardType.SECRET]: ["Act like you're incredibly bored for 2 minutes.", "Mimic the person who speaks next."],
      [CardType.CHAOS]: ["Swap phones with the person to your left for 1 round.", "The person to your right picks your next category."]
    }
  },
  [Difficulty.HARD]: {
    [Difficulty.HARD]: {}, // TypeScript safety
    [Intensity.CASUAL]: {
      [CardType.TRUTH]: ["What's the most embarrassing thing your parents have done?", "Have you ever peed in a pool?", "What's your biggest pet peeve?"],
      [CardType.DARE]: ["Tell the group a secret you've never told anyone else.", "Let someone draw on your arm with a pen.", "Dance for 1 minute with no music."],
      [CardType.SECRET]: ["For the next 5 minutes, you cannot say the word 'Yes'.", "Try to get someone to say 'Potato' without saying it yourself."],
      [CardType.CHAOS]: ["The current player chooses someone to do a dare with them.", "Everyone must speak in an accent for the next round."]
    },
    [Intensity.BOLD]: {
      [CardType.TRUTH]: ["What's the biggest lie you've ever told?", "Have you ever cheated on a test?", "What's the meanest thing you've said about someone here?"],
      [CardType.DARE]: ["Let someone look through your messages for 1 minute.", "Call a contact and tell them you just won the lottery.", "Exchange one item of clothing with the person to your left."],
      [CardType.SECRET]: ["Pretend you're getting a phone call and have a 1-minute conversation with a 'ghost'.", "Try to steal a small item from someone without them noticing."],
      [CardType.CHAOS]: ["The 'Silent Rule' starts: Anyone who speaks out of turn must do a dare.", "Swap all player names for the next 3 rounds."]
    },
    [Intensity.EXTREME]: {
      [CardType.TRUTH]: ["What is your deepest, darkest fear?", "What's the most illegal thing you've ever done?", "Who in this room do you like the least and why?"],
      [CardType.DARE]: ["Let someone send a 'Hey' text to your most recent crush.", "Eat a spoonful of a random condiment chosen by the group.", "Do your best 'crying' performance for 2 minutes."],
      [CardType.SECRET]: ["Pick a player and 'hate-stare' them every time they look at you for 5 minutes.", "Convinced the group you're leaving the game for a fake emergency."],
      [CardType.CHAOS]: ["The game intensity is locked to EXTREME for the next 10 minutes.", "Everyone must reveal the last photo they took."]
    }
  }
};

export const INTENSITY_INFO = {
  [Intensity.CASUAL]: { label: 'Casual', emoji: '🧒', color: 'bg-blue-500' },
  [Intensity.BOLD]: { label: 'Bold', emoji: '😏', color: 'bg-orange-500' },
  [Intensity.EXTREME]: { label: 'Extreme', emoji: '🔥', color: 'bg-red-600' }
};

export const DIFFICULTY_INFO = {
  [Difficulty.EASY]: { label: 'Easy', emoji: '🟢', color: 'bg-green-500' },
  [Difficulty.HARD]: { label: 'Hard', emoji: '🔴', color: 'bg-red-500' }
};

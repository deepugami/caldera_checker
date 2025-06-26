import { DiscordRole } from '@/types'

export const DISCORD_ROLES: DiscordRole[] = [
  // Highest tier - Regional Champion
  {
    id: 'regional-champion',
    name: 'Regional Champion',
    points: 1000
  },
  
  // Second tier - OG
  {
    id: 'og',
    name: 'OG',
    points: 900
  },
  
  // Third tier - cder-mafia
  {
    id: 'cder-mafia',
    name: 'cder-mafia',
    points: 800
  },
  
  // Fourth tier - hero, Titan, maestro (same level)
  {
    id: 'hero',
    name: 'hero',
    points: 700
  },
  {
    id: 'titan',
    name: 'Titan',
    points: 700
  },
  {
    id: 'maestro',
    name: 'maestro',
    points: 700
  },
  
  // Fifth tier - cder, core, young-cder
  {
    id: 'cder',
    name: 'cder',
    points: 600
  },
  {
    id: 'core',
    name: 'core',
    points: 600
  },
  {
    id: 'young-cder',
    name: 'young-cder',
    points: 600
  },
  
  // Sixth tier - Twitter engagement roles
  {
    id: 'twitter-degen',
    name: 'Twitter Degen',
    points: 500
  },
  {
    id: 'twitter-champion',
    name: 'Twitter Champion',
    points: 400
  },
  {
    id: 'twitter-supporter',
    name: 'Twitter Supporter',
    points: 300
  },
  {
    id: 'ash',
    name: 'ash',
    points: 300
  },
  
  // Seventh tier - Special roles
  {
    id: 'poker-twr',
    name: 'poker TWR',
    points: 250
  },
  {
    id: 'meme-lord',
    name: 'meme-lord',
    points: 200
  },
  
  // Option for users with no roles
  {
    id: 'no-roles',
    name: 'No Discord Roles',
    points: 0
  }
]

export const getRoleById = (id: string): DiscordRole | undefined => {
  return DISCORD_ROLES.find(role => role.id === id)
}

export const getRolesByIds = (ids: string[]): DiscordRole[] => {
  return ids.map(id => getRoleById(id)).filter(Boolean) as DiscordRole[]
}

export const calculateRoleScore = (selectedRoleIds: string[]): number => {
  const roles = getRolesByIds(selectedRoleIds)
  return roles.reduce((total, role) => total + role.points, 0)
}

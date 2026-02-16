export const mockUsers = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: '👨‍💻',
    bio: 'Full-stack developer passionate about teaching and learning new technologies',
    skillsOffered: ['React', 'Node.js', 'Python', 'Database Design'],
    skillsWanted: ['Machine Learning', 'UI/UX Design', 'Spanish'],
    rating: 4.8,
    completedExchanges: 12,
    activeMatches: []
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: '👩‍🎨',
    bio: 'Creative designer who loves sharing design principles and learning tech',
    skillsOffered: ['UI/UX Design', 'Figma', 'Graphic Design', 'Branding'],
    skillsWanted: ['React', 'Photography', 'Video Editing'],
    rating: 4.9,
    completedExchanges: 18,
    activeMatches: []
  },
  {
    id: 3,
    name: 'Marcus Williams',
    email: 'marcus@example.com',
    avatar: '👨‍🔬',
    bio: 'Data scientist eager to share ML knowledge and improve web dev skills',
    skillsOffered: ['Machine Learning', 'Python', 'Data Analysis', 'Statistics'],
    skillsWanted: ['React', 'Cloud Computing', 'Public Speaking'],
    rating: 4.7,
    completedExchanges: 10,
    activeMatches: []
  },
  {
    id: 4,
    name: 'Emma Rodriguez',
    email: 'emma@example.com',
    avatar: '👩‍🏫',
    bio: 'Language teacher passionate about cultural exchange and digital skills',
    skillsOffered: ['Spanish', 'French', 'Public Speaking', 'Writing'],
    skillsWanted: ['Web Development', 'Social Media Marketing', 'Photography'],
    rating: 5.0,
    completedExchanges: 25,
    activeMatches: []
  },
  {
    id: 5,
    name: 'David Kim',
    email: 'david@example.com',
    avatar: '👨‍💼',
    bio: 'Digital marketer looking to expand into development and design',
    skillsOffered: ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media'],
    skillsWanted: ['JavaScript', 'UI/UX Design', 'Data Analysis'],
    rating: 4.6,
    completedExchanges: 8,
    activeMatches: []
  }
];

export const mockExchanges = [
  {
    id: 1,
    userId: 1,
    partnerId: 3,
    skill: 'React',
    partnerSkill: 'Machine Learning',
    status: 'completed',
    sessionsCompleted: 6,
    totalSessions: 6,
    startDate: '2024-01-15',
    endDate: '2024-02-10',
    rating: 5
  },
  {
    id: 2,
    userId: 1,
    partnerId: 2,
    skill: 'Node.js',
    partnerSkill: 'UI/UX Design',
    status: 'active',
    sessionsCompleted: 3,
    totalSessions: 8,
    startDate: '2024-02-01',
    endDate: null,
    rating: null
  },
  {
    id: 3,
    userId: 1,
    partnerId: 4,
    skill: 'Python',
    partnerSkill: 'Spanish',
    status: 'active',
    sessionsCompleted: 2,
    totalSessions: 10,
    startDate: '2024-02-05',
    endDate: null,
    rating: null
  }
];

export const skillCategories = [
  'Programming',
  'Design',
  'Languages',
  'Marketing',
  'Data Science',
  'Business',
  'Creative Arts',
  'Other'
];

export const popularSkills = [
  'React', 'Python', 'JavaScript', 'UI/UX Design', 'Machine Learning',
  'Node.js', 'Spanish', 'Graphic Design', 'Public Speaking', 'Digital Marketing',
  'Data Analysis', 'SEO', 'Photography', 'Video Editing', 'French'
];

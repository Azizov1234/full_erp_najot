import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, Divider, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaymentsIcon from '@mui/icons-material/Payments';
import QuizIcon from '@mui/icons-material/Quiz';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Asosiy', icon: <DashboardIcon />, path: '/dashboard' },
  { text: "O'qituvchilar", icon: <PeopleIcon />, path: '/teachers', premium: true },
  { text: 'Guruhlar', icon: <GroupsIcon />, path: '/groups' },
  { text: 'Talabalar', icon: <SchoolIcon />, path: '/students', premium: true },
  { text: 'Boshqarish', icon: <SettingsIcon />, path: '/management' },
];

export default function Sidebar({ openSettings, setOpenSettings, isSidebarCollapsed, setIsSidebarCollapsed, isManagementMenuOpen, setIsManagementMenuOpen, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const collapsed = isMobile ? false : isSidebarCollapsed;

  const tokenVal = localStorage.getItem('token');
  let role = '';
  if (tokenVal) {
    try {
      const payload = JSON.parse(atob(tokenVal.split('.')[1]));
      role = payload.role;
    } catch (e) {
      console.error(e);
    }
  }

  const studentMenuItems = [
    { text: 'Bosh sahifa', icon: <HomeIcon />, path: '/student/dashboard' },
    { text: "To'lovlarim", icon: <PaymentsIcon />, path: '/student/payments' },
    { text: 'Guruhlarim', icon: <GroupsIcon />, path: '/student/groups' },
    { text: "Ko'rsatkichlarim", icon: <AssignmentIcon />, path: '/student/indicators' },
    { text: 'Reyting', icon: <WorkspacePremiumIcon />, path: '/student/rating' },
    { text: "Do'kon", icon: <ShoppingCartIcon />, path: '/student/shop' },
    { text: 'Qo\'shimcha darslar', icon: <RssFeedIcon />, path: '/student/extra-lessons' },
    { text: 'Sozlamalar', icon: <SettingsIcon />, path: '/student/settings' },
  ];

  const isStudent = role === 'STUDENT' || /^\/student(\/|$)/.test(location.pathname);

  const itemsToRender = isStudent
    ? studentMenuItems
    : role === 'TEACHER'
    ? [
        { text: 'Guruhlar', icon: <GroupsIcon />, path: '/groups' },
        { text: 'Profil', icon: <AccountCircleIcon />, path: '/profile' }
      ]
    : menuItems;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Mobil Drawer yopish uchun yordamchi funksiya
  const closeMobileIfNeeded = () => {
    if (onMobileClose) onMobileClose();
  };

  const activeStyles = isStudent
    ? {
        backgroundColor: '#faede0',
        color: '#c5a059',
        borderRadius: '12px',
        '&:hover': { backgroundColor: '#f3e2d1' },
        '& .MuiListItemIcon-root': { color: '#c5a059' }
      }
    : {
        backgroundColor: '#c5a059',
        color: '#fff',
        borderRadius: '12px',
        '&:hover': { backgroundColor: '#b89350' },
        '& .MuiListItemIcon-root': { color: '#fff' }
      };

  const defaultStyles = {
    borderRadius: '12px',
    marginBottom: '4px',
    color: '#6b7280',
    '&:hover': { backgroundColor: '#f9fafb', color: '#111827' },
    '& .MuiListItemIcon-root': { color: '#6b7280' }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexShrink: 0, position: 'relative', zIndex: 1300 }}>
      <Box sx={{ position: 'relative', height: '100%' }}>
        <IconButton
          size="small"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          sx={{
            display: isStudent ? 'none' : { xs: 'none', md: 'flex' },
            backgroundColor: '#fff',
            color: '#6b7280',
            border: '1.5px solid #e5e7eb',
            borderRadius: '8px',
            width: 24,
            height: 24,
            '&:hover': { backgroundColor: '#f3f4f6', color: '#374151' },
            position: 'absolute',
            right: -12,
            top: 32,
            zIndex: 1500,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 12, transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </IconButton>

        <Box
          sx={{
            width: { xs: 260, md: collapsed ? 80 : 260 },
            flexShrink: 0,
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '0 0 30px 0',
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Logo Area */}
          <Box sx={{
            height: isStudent ? { xs: 56, sm: 64 } : undefined,
            p: isStudent ? { xs: '0 16px', sm: '0 20px' } : 2.5,
            pb: isStudent ? 0 : 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: isStudent ? '1.5px solid #e2e8f0' : 'none',
            flexShrink: 0,
          }}>
            {collapsed ? (
              <svg width="32" height="32" viewBox="61 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M120.065 12.0162L118.502 12.2935C115.493 12.8274 112.538 13.6348 109.672 14.7059V6.04044L108.838 6.41941C106.951 7.27903 105.16 8.18024 103.45 9.12767L103.396 0.0647025L102.484 0.651646C98.1603 3.44229 94.1295 6.67423 90.4547 10.2969C86.7935 6.81187 82.8941 3.59338 78.7855 0.665511L77.8738 0V9.3911C76.014 8.3343 74.1102 7.37146 72.1623 6.5026L71.3327 6.13749L71.3691 14.1745C68.5993 13.2011 65.7286 12.5529 62.8132 12.2426L61.4138 12.0994L72.609 26.2877L72.5588 15.9029C74.3832 16.625 76.1587 17.4679 77.8738 18.4263V27.4154L77.9923 27.5771C81.2834 32.0693 89.9396 39.3761 90.2997 39.6857L90.6735 40L91.0518 39.6857C91.4165 39.3807 100.082 32.1479 103.359 27.4801L103.555 27.1473L103.501 18.7776C105.122 17.9107 106.787 17.1286 108.487 16.4344V26.3432L120.065 12.0162ZM109.672 15.9861C112.093 15.0549 114.582 14.3163 117.116 13.777L109.672 23.0202V15.9861ZM64.0895 13.6291C66.5631 13.999 68.9941 14.6182 71.3463 15.4778L71.3828 22.8723L64.0895 13.6291ZM102.224 2.25534V9.81629C99.6523 11.307 97.1932 12.9892 94.8671 14.8492C94.3703 14.2946 93.8552 13.74 93.331 13.1854C92.6685 12.4922 91.9893 11.802 91.2934 11.115C94.6506 7.81199 98.3142 4.84505 102.233 2.25534M82.4002 19.8174C81.2971 19.0657 80.1803 18.3632 79.0499 17.71V11.4754C81.2456 12.8224 83.3613 14.2993 85.3859 15.8983C84.3496 17.1646 83.3544 18.4741 82.4002 19.8267M86.293 16.6378C87.4417 17.5621 88.5721 18.565 89.657 19.5864C88.6025 20.6647 87.5708 21.7986 86.5619 22.9879C85.6503 22.2068 84.5563 21.3657 83.3711 20.5061C84.3101 19.1812 85.2886 17.8918 86.3067 16.6378M93.9783 15.5979C92.7885 16.5962 91.6353 17.6407 90.5094 18.7452C89.385 17.6946 88.2363 16.684 87.0633 15.7135C88.1604 14.4163 89.3015 13.1608 90.4866 11.9469C91.7173 13.1516 92.8812 14.3655 93.9783 15.5887M93.8005 23.8059C92.2233 25.0907 91.1293 26.1167 90.5641 26.6898C90.0217 26.1167 88.9733 25.0537 87.4827 23.7504C88.4764 22.5765 89.4929 21.4597 90.5322 20.3998C91.6596 21.4905 92.749 22.6258 93.8005 23.8059ZM86.7169 24.6655C87.9109 25.6914 89.0433 26.7887 90.1083 27.9515L90.5413 28.446L90.9971 27.9838C92.1301 26.819 93.3344 25.7277 94.6027 24.7163C95.3473 25.5698 96.0675 26.4464 96.7634 27.346L90.71 33.1092L84.5882 27.3692C85.2856 26.4448 85.9876 25.5205 86.7032 24.6701M91.3572 19.5633C92.4603 18.4818 93.5863 17.4604 94.7577 16.4853C95.955 17.8625 97.0657 19.249 98.0898 20.6447L97.7662 20.8619C96.6312 21.6337 95.6147 22.3824 94.7167 23.0757C93.6349 21.8648 92.515 20.6971 91.3572 19.5725M95.6694 15.7504C97.7546 14.088 99.9492 12.5717 102.238 11.212V18.1167C101.089 18.7499 100.032 19.383 99.0699 19.9977C98.0245 18.5773 96.888 17.1616 95.6603 15.7504M79.0407 2.3108C82.757 5.0102 86.2943 7.95435 89.6297 11.1242C89.0143 11.7527 88.4126 12.3859 87.8063 13.0375C87.2001 13.6892 86.6896 14.327 86.1517 14.9786C83.8945 13.1917 81.5253 11.5553 79.059 10.0797L79.0407 2.3108ZM74.2409 15.3021C73.6756 15.0572 73.1058 14.84 72.5361 14.6089L72.5041 7.97689C74.3275 8.81802 76.1128 9.74234 77.8601 10.7499V17.063C76.6613 16.4159 75.4534 15.8244 74.2409 15.3021ZM81.7119 20.7972C80.782 22.156 79.8916 23.5532 79.0407 24.989V19.1057C80.0025 19.6742 80.896 20.2473 81.7119 20.8065M90.6735 38.4471C88.996 37.0098 82.1267 31.0526 79.1547 27.1704C80.2639 25.1985 81.4384 23.3021 82.6783 21.4812C83.8406 22.3131 84.889 23.1358 85.8007 23.8983C84.962 24.9151 84.1415 25.978 83.3255 27.0872L83.0065 27.517L90.71 34.7452L98.3223 27.4523L97.9896 27.0225C97.1873 25.978 96.3562 24.9582 95.4962 23.963C96.3577 23.2975 97.3195 22.5765 98.4135 21.8463L98.7827 21.6014C100.034 23.3534 101.174 25.1842 102.197 27.0826C99.2385 31.0895 92.3555 37.0191 90.6735 38.4471ZM102.256 24.7718C101.509 23.5055 100.684 22.233 99.781 20.9544C100.542 20.4691 101.367 19.97 102.247 19.4708L102.256 24.7718ZM103.505 17.4327L103.46 10.5003C105.059 9.57597 106.732 8.73021 108.474 7.90757V15.145C106.678 15.8614 105.014 16.6424 103.487 17.4327" fill="#c5a059" />
              </svg>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="img" src="/najot-logo.svg" sx={{ height: 26 }} />
                <Box sx={{
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  fontSize: '0.58rem',
                  fontWeight: 800,
                  px: 0.8,
                  py: 0.1,
                  borderRadius: '6px',
                  alignSelf: 'flex-start',
                  mt: -0.4,
                }}>
                  Beta
                </Box>
              </Box>
            )}
          </Box>

          {/* Main Menu */}
          <List sx={{ px: collapsed ? 1 : 2, flex: 1, overflowY: 'auto' }}>
            {itemsToRender.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/management' && location.pathname.startsWith('/management'));
              
              const handleClick = (e) => {
                if (item.text === 'Boshqarish') {
                  e.preventDefault();
                  setIsManagementMenuOpen(!isManagementMenuOpen);
                }
                // Mobil Drawer yopilsin
                closeMobileIfNeeded();
              };
 
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    onClick={handleClick}
                    sx={{
                      ... (isActive ? activeStyles : defaultStyles),
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      px: collapsed ? 0 : 2,
                      minHeight: 52,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, justifyContent: 'center', color: isActive ? (isStudent ? '#c5a059' : '#fff') : '#6b7280' }}>
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: isActive ? 700 : 600, color: isActive ? (isStudent ? '#c5a059' : '#fff') : '#374151' }}>{item.text}</Typography>
                        {item.premium && <WorkspacePremiumIcon sx={{ fontSize: 16, color: '#fbbf24' }} />}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Subscription Box */}
          {!collapsed && role !== 'TEACHER' && role !== 'STUDENT' && (
            <Box sx={{ p: 2, mb: 2, mx: 1.5, backgroundColor: '#f9fafb', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: 36, height: 36, backgroundColor: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <Box component="img" src="/subscription-icon.png" sx={{ width: 24 }} onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/5661/5661380.png'; }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>Subscription</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', lineHeight: 1.2 }}>You can renew your premium subscription.</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '40%', backgroundColor: '#c5a059', borderRadius: 3 }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 500 }}>1y 4m 12h</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #f3f4f6' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                  <BoltIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#4b5563' }}>Upgrade now</Typography>
                </Box>
                <IconButton size="small" sx={{ p: 0.5 }}>
                  <OpenInNewIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Logout Button */}
          {!isStudent && (
            <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid #f3f4f6' }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    ...defaultStyles,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 0 : 2,
                    minHeight: 52,
                    color: '#ef4444',
                    '&:hover': { backgroundColor: '#fef2f2', color: '#dc2626' },
                    '& .MuiListItemIcon-root': { color: '#ef4444' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, justifyContent: 'center' }}>
                    <LogoutIcon sx={{ fontSize: 22 }} />
                  </ListItemIcon>
                  {!collapsed && (
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>Chiqish</Typography>
                  )}
                </ListItemButton>
              </ListItem>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

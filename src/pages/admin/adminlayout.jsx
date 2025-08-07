import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminTopBar from '../../components/admintopbar';
import AdminSidebar from '../../components/adminsidebar';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Always show sidebar on desktop by default
  const drawerVariant = 'permanent';

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top Bar */}
      <AdminTopBar 
        onMenuClick={handleDrawerToggle} 
        title="Admin Dashboard"
      />
      
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <AdminSidebar 
          open={true} // Always open on desktop
          onClose={handleDrawerClose}
          onTransitionEnd={handleDrawerTransitionEnd}
          variant={drawerVariant}
        />
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          marginLeft: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar /> {/* This pushes content below the AppBar */}
        {children || <Outlet />} {/* Render child routes or direct children */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin, Calendar, Star, Shield } from "lucide-react";
import { containerVariants, itemVariants, glassRevealVariants } from "@/lib/animations";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => setLoading(false), 300);
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageTransition>
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-work-sans font-bold mb-2 text-neutral-900">Profile</h1>
            <p className="text-neutral-600 font-gruppo">Manage your personal information</p>
          </div>

          {/* Profile Card - Animated Glassmorphism */}
          <motion.div 
            variants={glassRevealVariants}
            className="glass rounded-2xl p-8 shadow-xl shadow-neutral-900/5"
          >
            {/* Avatar Section */}
            <div className="flex items-start space-x-6 mb-8 pb-8 border-b border-neutral-200/60">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-white font-work-sans font-bold text-4xl shadow-2xl shadow-gold-500/30">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-work-sans font-bold mb-1 text-neutral-900">{user?.full_name || 'User'}</h2>
                <p className="text-neutral-600 font-gruppo mb-3">{user?.email}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="px-3 py-1 bg-gold-500/10 text-gold-700 rounded-full font-work-sans font-semibold border border-gold-500/20">
                    {user?.preferred_brand || 'Platinum Member'}
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/10 text-green-700 rounded-full font-gruppo border border-green-500/20">
                    <Shield size={14} />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="p-4 glass rounded-xl transition-smooth hover-lift">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-gruppo">Email Address</p>
                    <p className="font-work-sans font-semibold">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="p-4 glass rounded-xl transition-smooth hover-lift">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-gruppo">Phone Number</p>
                    <p className="font-work-sans font-semibold">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Preferred Brand */}
              <div className="p-4 glass rounded-xl transition-smooth hover-lift">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Star size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-gruppo">Preferred Maison</p>
                    <p className="font-work-sans font-semibold">{user?.preferred_brand || 'Cartier'}</p>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="p-4 glass rounded-xl transition-smooth hover-lift">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-gruppo">Member Since</p>
                    <p className="font-work-sans font-semibold">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            {user?.address && (
              <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-neutral-200/60">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-gruppo mb-1">Address</p>
                    <p className="font-work-sans font-semibold">{user.address}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Account Stats - Staggered Animation */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-xl border border-blue-200/60 rounded-2xl p-6 shadow-lg"
            >
              <p className="text-sm text-blue-700 font-gruppo mb-2">Account Status</p>
              <p className="text-2xl font-work-sans font-bold text-blue-900">Active</p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-xl border border-green-200/60 rounded-2xl p-6 shadow-lg"
            >
              <p className="text-sm text-green-700 font-gruppo mb-2">Security Level</p>
              <p className="text-2xl font-work-sans font-bold text-green-900">Enhanced</p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-xl border border-purple-200/60 rounded-2xl p-6 shadow-lg"
            >
              <p className="text-sm text-purple-700 font-gruppo mb-2">Member Tier</p>
              <p className="text-2xl font-work-sans font-bold text-purple-900">Platinum</p>
            </motion.div>
          </motion.div>
          </motion.div>
        </PageTransition>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

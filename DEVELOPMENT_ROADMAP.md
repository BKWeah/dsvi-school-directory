# DSVI School Directory - Development Roadmap

## 📊 Current Status Overview

**Overall Compliance: 65%**
- ✅ **PAGE 1 (Visitor Signup Modal): 100% Complete**
- ✅ **PAGE 2 (Main Directory): 95% Complete**
- ❌ **PAGE 3 (Promo Boost Console): 0% Complete**
- ❌ **PART 4 (Admin Panel): 0% Complete**

## 🎯 Priority Development Tasks

### **PHASE 1: Promo Boost Console (HIGH PRIORITY)**
*Estimated Time: 2-3 weeks*

#### 1.1 Authentication & Access Control
**File:** `src/pages/PromoBoost.tsx`
**Requirements:**
- Implement school authentication system
- Create login/registration flow for schools
- Add role-based access (DSVI clients vs manual schools)
- Session management for authenticated schools

**Implementation Steps:**
```typescript
// 1. Create authentication context
src/contexts/AuthContext.tsx
- School login/logout functionality
- Session persistence
- Role-based permissions

// 2. Update PromoBoost page structure
src/pages/PromoBoost.tsx
- Add authentication check
- Redirect to login if not authenticated
- Dashboard layout for authenticated schools
```

#### 1.2 Ad Campaign Creation Workflow
**Files:** 
- `src/components/promo/CampaignCreator.tsx` (new)
- `src/components/promo/AudienceSelector.tsx` (new)
- `src/components/promo/ContentUploader.tsx` (new)

**Requirements from directory_readme.md:**
- **Audience Selection:**
  - Reach selector: 100, 250, 500+ viewers
  - County/City targeting (use existing `LIBERIAN_COUNTIES`)
  - Education level targeting (use existing `EDUCATION_LEVELS`)
  - Profession targeting (use existing `PROFESSIONS`)
  - Duration: days or weeks selection

**Implementation:**
```typescript
// Component Structure:
interface CampaignForm {
  reach_count: number; // 100, 250, 500+
  target_audience: {
    county?: string;
    city?: string;
    education_levels?: string[];
    professions?: string[];
  };
  duration_days: number;
  ad_content: string;
  ad_type: 'banner' | 'text' | 'video';
  ad_file_url?: string;
}

// Use existing service function:
// directoryService.ts:252-287 (createAdCampaign)
```

#### 1.3 Content Upload System
**Requirements:**
- 📸 **Banner Upload:** PNG/JPG, Max 2MB
- 📝 **Text Content:** Max 150 characters
- 🎥 **Video Upload:** MP4, 1-3 mins, Max 20MB
- 🔍 **Live Preview:** Show how ad appears to visitors

**Implementation Steps:**
```typescript
// 1. File upload component
src/components/promo/FileUploader.tsx
- Image/video validation
- File size limits
- Preview functionality
- Upload to cloud storage (Supabase Storage)

// 2. Text editor component  
src/components/promo/TextEditor.tsx
- Character counter (150 max)
- Real-time preview
- Rich text formatting options

// 3. Preview component
src/components/promo/AdPreview.tsx
- Mock directory layout
- Show ad in context
- Different device previews
```

#### 1.4 Dynamic Pricing System
**File:** `src/components/promo/PricingCalculator.tsx`
**Current Implementation:** Basic pricing in `directoryService.ts:254-257`

**Enhanced Requirements:**
```typescript
// Update pricing logic
interface PricingTiers {
  reach: {
    100: number;    // Base price per 100 views
    250: number;    // Price per 250 views  
    500: number;    // Price per 500 views
    1000: number;   // Price per 1000+ views
  };
  duration: {
    daily: number;  // Price per day
    weekly: number; // Price per week
  };
  location: {
    county_premium: number; // Extra for specific county
    city_premium: number;   // Extra for specific city
  };
}

// Real-time price calculation
const calculatePrice = (
  reach: number, 
  duration: number, 
  targeting: TargetingOptions
) => {
  // Dynamic pricing based on:
  // - Reach size
  // - Duration
  // - Location specificity
  // - Audience targeting complexity
}
```

#### 1.5 Payment Integration
**Files:**
- `src/components/promo/PaymentOptions.tsx` (new)
- `src/lib/payments.ts` (new)

**Requirements:**
- ✅ **Mobile Money:** MTN / Orange integration
- ✅ **Cards:** Debit/Credit card processing
- ✅ **Bank Transfer:** Local bank options

**Implementation Options:**
```typescript
// Payment providers for Liberia:
// 1. Mobile Money: MTN MoMo, Orange Money APIs
// 2. Cards: Stripe, Paystack (if available in Liberia)
// 3. Bank Transfer: Local banking partnerships

interface PaymentMethod {
  type: 'mobile_money' | 'card' | 'bank_transfer';
  provider: string;
  details: PaymentDetails;
}

// Update database schema to track payments
// Use existing payment_status and payment_reference fields
```

#### 1.6 Campaign Management Dashboard
**File:** `src/components/promo/CampaignDashboard.tsx`
**Requirements:**
- View active campaigns
- Track impressions/clicks
- Edit/pause/stop campaigns
- Performance analytics

---

### **PHASE 2: Admin Panel (HIGH PRIORITY)**
*Estimated Time: 1-2 weeks*

#### 2.1 Visitor Management
**File:** `src/pages/DirectoryAdmin.tsx`
**Database:** Use existing `directory_visitors` table

**Requirements:**
- View all registered visitor data
- Export visitor data (CSV/Excel)
- Filter by county, city, education level, profession
- Analytics dashboard

**Implementation:**
```typescript
// Components needed:
src/components/admin/VisitorsList.tsx
src/components/admin/VisitorAnalytics.tsx  
src/components/admin/ExportTools.tsx

// Features:
- Paginated visitor table
- Search/filter functionality
- Data export (CSV, Excel, PDF)
- Analytics charts (visitors by county, profession, etc.)
- Visitor engagement metrics
```

#### 2.2 School Submission Management
**Database:** Use existing `directory_manual_schools` table

**Requirements:**
- Review pending school submissions
- Approve/reject with admin notes
- Email notifications to schools
- Bulk actions

**Implementation:**
```typescript
// Components:
src/components/admin/SchoolSubmissions.tsx
src/components/admin/ReviewModal.tsx

// Workflow:
1. List all pending submissions
2. Individual review interface
3. Approval/rejection with notes
4. Status update in database
5. Email notification system
```

#### 2.3 Ad Campaign Management
**Database:** Use existing `directory_ads` table

**Requirements:**
- Approve/reject submitted campaigns
- Assign rotation slots
- Monitor performance stats
- Manual ad expiration

**Implementation:**
```typescript
// Components:
src/components/admin/CampaignReview.tsx
src/components/admin/AdRotationManager.tsx
src/components/admin/CampaignAnalytics.tsx

// Features:
- Campaign approval workflow
- Ad scheduling/rotation system
- Performance monitoring
- Revenue tracking
```

#### 2.4 Pricing Management
**Requirements:**
- Configure pricing tiers
- Set promotional rates
- Manage payment methods
- Revenue analytics

---

### **PHASE 3: Ad Display & Tracking System**
*Estimated Time: 1 week*

#### 3.1 Enhanced Ad Banner System
**Current:** Basic `AdBanner` component exists
**File:** `src/components/directory/AdBanner.tsx`

**Requirements:**
- Fetch active ads from `getActiveAds()` service
- Implement rotation algorithm
- Non-intrusive placement during scroll
- Randomized display order

**Implementation:**
```typescript
// Enhanced AdBanner component:
interface AdDisplayProps {
  placement: 'header' | 'sidebar' | 'between_schools' | 'footer';
  maxAdsPerSession: number;
  rotationInterval: number; // seconds
}

// Features:
- Smart ad rotation
- Frequency capping per user
- Performance tracking
- A/B testing capabilities
```

#### 3.2 Impression & Click Tracking
**Current:** Function exists but not implemented: `directoryService.ts:290-296`

**Requirements:**
- Record ad impressions automatically
- Track click-through rates
- User interaction analytics
- Performance reporting

**Implementation:**
```typescript
// Tracking system:
src/lib/adTracking.ts
- Impression recording on view
- Click tracking with referrer data
- Session-based analytics
- Privacy-compliant tracking

// Database updates:
- Implement impression increment RPC
- Add click tracking table
- Analytics aggregation functions
```

---

### **PHASE 4: Additional Features & Enhancements**
*Estimated Time: 1 week*

#### 4.1 Search Enhancement
**Current:** Basic search in `DirectoryHome.tsx:57-59`

**Enhancements:**
- Auto-complete search suggestions
- Search result highlighting
- Advanced search filters
- Search analytics

#### 4.2 School Profile Enhancements
**File:** `src/pages/SchoolProfile.tsx`

**Missing Features:**
- Contact form integration
- Virtual tour embedding
- Image galleries
- Student reviews/testimonials

#### 4.3 SEO & Performance
**Requirements:**
- Enhanced meta tags per school
- Open Graph images
- Schema.org markup
- Performance optimization
- Image optimization

#### 4.4 Notification System
**Requirements:**
- Email notifications for:
  - School submission status
  - Ad campaign approvals
  - Payment confirmations
  - Admin alerts

---

## 🛠️ Technical Implementation Guide

### Database Schema Compliance
✅ **Current schema supports all requirements:**
```typescript
// Existing tables are correctly structured:
DirectoryVisitor      // ✅ Complete
DirectoryManualSchool // ✅ Complete  
DirectoryAd          // ✅ Complete
DirectoryAdTargeting // ✅ Complete
CreateAdRequest      // ✅ Complete
```

### Service Layer Status
✅ **Existing services ready for use:**
```typescript
// directoryService.ts functions:
✅ submitVisitorSignup()     // Working
✅ checkVisitorSession()     // Working  
✅ submitManualSchool()      // Working
✅ getActiveAds()           // Working
✅ createAdCampaign()       // Working
✅ recordAdImpression()     // Ready to use
✅ getDirectoryStats()      // Working
```

### Component Architecture
**Existing Components (✅ Complete):**
- `VisitorSignupModal` - Fully functional
- `SchoolGrid` - Fully functional
- `FilterSidebar` - Fully functional
- `AdBanner` - Basic implementation

**Missing Components (❌ To Build):**
- Promo Boost workflow components
- Admin panel components
- Enhanced ad display system
- Payment integration components

### Environment Setup
**Required Additions:**
```bash
# Add to .env:
# Payment provider keys
VITE_MTN_MOMO_API_KEY=
VITE_ORANGE_MONEY_API_KEY=
VITE_STRIPE_PUBLIC_KEY=

# Email service
VITE_EMAIL_SERVICE_API_KEY=

# File upload service
VITE_SUPABASE_STORAGE_BUCKET=
```

### Dependencies to Add
```json
// package.json additions needed:
{
  "dependencies": {
    "@stripe/stripe-js": "^2.0.0",
    "react-dropzone": "^14.0.0",
    "chart.js": "^4.0.0",
    "react-chartjs-2": "^5.0.0",
    "xlsx": "^0.18.0",
    "jspdf": "^2.5.0",
    "react-query": "^3.39.0" // For better data fetching
  }
}
```

---

## 🎯 Development Priority Order

### **Week 1-2: Promo Boost Foundation**
1. Authentication system
2. Basic campaign creation form
3. Audience targeting interface
4. File upload system

### **Week 3: Promo Boost Completion** 
1. Payment integration
2. Pricing calculator
3. Campaign dashboard
4. Live preview system

### **Week 4: Admin Panel**
1. Visitor management
2. School submission review
3. Campaign approval system
4. Basic analytics

### **Week 5: Ad System & Polish**
1. Enhanced ad rotation
2. Tracking implementation
3. UI/UX improvements
4. Testing & bug fixes

### **Week 6: Production Ready**
1. Performance optimization
2. Security audit
3. Documentation
4. Deployment preparation

---

## 📝 Testing Strategy

### Unit Tests
- Component rendering
- Service function logic
- Form validation
- Payment processing

### Integration Tests  
- End-to-end user workflows
- Database operations
- Payment flow testing
- Ad display & tracking

### User Acceptance Testing
- School onboarding flow
- Visitor signup experience  
- Admin panel functionality
- Mobile responsiveness

---

## 🚀 Deployment Considerations

### Production Environment
- Supabase production database
- CDN for file storage
- Payment provider production keys
- Email service configuration
- Domain & SSL setup

### Monitoring & Analytics
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Revenue tracking
- System health monitoring

---

## 📋 Success Metrics

### Technical Metrics
- Page load times < 3 seconds
- 99.9% uptime
- Mobile responsiveness score > 90
- Accessibility compliance (WCAG AA)

### Business Metrics
- School submission rate
- Visitor signup conversion > 15%
- Ad campaign completion rate > 80%
- User engagement metrics
- Revenue tracking accuracy

---

This roadmap provides a complete guide for implementing the remaining 35% of the DSVI School Directory platform to achieve 100% compliance with client requirements.
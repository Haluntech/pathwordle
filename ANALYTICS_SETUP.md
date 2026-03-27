# Google Analytics 4 (GA4) Configuration

## ✅ Basic Setup Complete

Your Google Analytics 4 tracking code has been added to `index.html`:

**Measurement ID:** `G-FHENCTMKTY`

**Location:** In the `<head>` tag, loads before all other scripts for optimal tracking.

---

## 📊 Recommended Event Tracking

To get the most out of GA4, you should track these custom events in your game:

### 1. **Game Start Events**
Track when users start playing:

```javascript
gtag('event', 'game_start', {
  'game_mode': 'daily', // or 'practice'
  'device_type': /Mobile|Tablet|Desktop/.test(navigator.userAgent),
  'screen_width': window.screen.width
});
```

### 2. **Game Completion Events**
Track wins and losses:

```javascript
gtag('event', 'game_complete', {
  'result': 'won', // or 'lost'
  'attempts_used': 4,
  'max_attempts': 6,
  'time_seconds': 123,
  'game_mode': 'daily'
});
```

### 3. **Hint Usage**
Track when users request hints:

```javascript
gtag('event', 'hint_used', {
  'hint_type': 'first_letter', // or 'common_letters', 'next_letter', etc.
  'attempts_remaining': 3,
  'game_mode': 'daily'
});
```

### 4. **Social Sharing**
Track when users share results:

```javascript
gtag('event', 'share', {
  'platform': 'twitter', // or 'facebook', 'whatsapp', 'copy_link'
  'game_result': 'won',
  'attempts_used': 4
});
```

### 5. **Page View Events**
Track navigation to important modals:

```javascript
// Statistics view
gtag('event', 'page_view', {
  'page_title': 'Statistics',
  'page_location': window.location.href + '#statistics'
});

// How to Play view
gtag('event', 'page_view', {
  'page_title': 'How to Play',
  'page_location': window.location.href + '#how-to-play'
});
```

### 6. **Engagement Events**
Track user interactions:

```javascript
// Button clicks
gtag('event', 'engagement', {
  'action': 'button_click',
  'target': 'theme_toggle',
  'current_theme': 'dark'
});

// Tooltip views
gtag('event', 'tooltip_view', {
  'target': 'game_mode_switch',
  'current_mode': 'daily'
});
```

### 7. **Error Events**
Track errors for debugging:

```javascript
gtag('event', 'error', {
  'error_type': 'invalid_word',
  'message': 'Not in word list',
  'attempted_word': 'ABCDE'
});
```

---

## 🎯 Custom Conversions

Set up these custom conversions in GA4:

### 1. **First Game Completion**
- **Event:** `game_complete`
- **Condition:** `result == 'won'`
- **Value:** Track new players who complete their first game

### 2. **Daily Challenge Player**
- **Event:** `game_start`
- **Condition:** `game_mode == 'daily'`
- **Value:** Track daily active players

### 3. **Social Sharer**
- **Event:** `share`
- **Condition:** Any share event
- **Value:** Track viral potential

### 4. **Returning Player**
- **Event:** `session_start`
- **Condition:** `sessions > 1`
- **Value:** Track retention

---

## 📈 Key Metrics to Monitor

### User Acquisition
- **Users:** Total unique visitors
- **New Users:** First-time visitors
- **Sessions:** Total visits
- **Sessions per User:** Engagement level

### Engagement
- **Average Session Duration:** Time spent playing
- **Pages per Session:** Screens viewed
- **Event Count:** Total interactions
- **Retention Rate:** Returning players

### Behavioral
- **Win Rate:** `game_complete` with `result == 'won'`
- **Average Attempts:** Mean of `attempts_used`
- **Hint Usage Rate:** `hint_used` / total games
- **Share Rate:** `share` / total games completed

### Monetization (for AdSense)
- **Page Views:** Total ad impressions
- **Ad Revenue:** From linked AdSense account
- **RPM:** Revenue per 1000 pageviews
- **Click-Through Rate:** Ad engagement

---

## 🔗 Linking Google Analytics with AdSense

### Step 1: Link Accounts
1. Go to [Google Analytics Admin](https://analytics.google.com/admin)
2. Select your property: `G-FHENCTMKTY`
3. Go to **Product Linking** > **AdSense**
4. Click **Link AdSense account**
5. Follow the prompts

### Benefits of Linking:
- See ad revenue in GA4 reports
- Understand which content generates most revenue
- Analyze user behavior by revenue
- Optimize ad placements based on data

---

## 🎨 Custom Dimensions

Create these custom dimensions for better analysis:

### User Properties
```javascript
// Set user properties
gtag('set', 'user_properties', {
  'favorite_mode': 'daily', // or 'practice'
  'player_type': 'casual', // or 'hardcore', 'new'
  'days_played': 5
});
```

### Recommended Dimensions
1. **Game Mode** (`daily` vs `practice`)
2. **Device Type** (`mobile`, `tablet`, `desktop`)
3. **Player Segment** (`new`, `returning`, `power_user`)
4. **Time of Day** (`morning`, `afternoon`, `evening`, `night`)

---

## 📊 Dashboards to Create

### 1. **Daily Overview**
- Total users today
- Games completed
- Win rate
- Average session duration
- Top 5 hints used
- Share rate

### 2. **User Engagement**
- Sessions per user
- Retention rate (7-day, 30-day)
- Time spent in each game mode
- Feature usage (hints, stats, sharing)

### 3. **Monetization**
- Ad revenue by page
- RPM by country
- Top earning content
- Revenue by device type

### 4. **Funnel Analysis**
1. Visit site
2. Start first game
3. Complete first game
4. Share result
5. Return tomorrow

---

## 🎯 Implementation Priority

### Phase 1: Essential (Do Now)
- ✅ Basic pageview tracking (already done)
- ✅ Game start event
- ✅ Game completion event (win/loss)
- ✅ Share event

### Phase 2: Important (Week 1)
- Hint usage tracking
- Statistics modal views
- How to Play modal views
- Theme toggle usage

### Phase 3: Advanced (Week 2-3)
- Custom user properties
- Funnel events
- Error tracking
- Advanced behavioral events

---

## 🔍 Debugging & Testing

### Test Real-Time Tracking
1. Open your site
2. Go to [GA4 Real-Time report](https://analytics.google.com/test?)
3. Check if your visit appears
4. Trigger some events
5. Verify they show in Real-Time

### DebugView Setup
1. Install [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Enable DebugView in GA4
3. Open your site with the extension enabled
4. See events in real-time with parameters

### Common Issues & Fixes

**Issue:** Events not appearing
- **Fix:** Check ad blocker, verify Measurement ID is correct

**Issue:** Duplicate events
- **Fix:** Ensure gtag.js is only loaded once

**Issue:** Missing parameters
- **Fix:** Double-check event object syntax

---

## 📱 Cross-Domain Tracking

If you expand to multiple domains:

```javascript
gtag('config', 'G-FHENCTMKTY', {
  'linker': {
    'domains': ['pathwordle.com', 'blog.pathwordle.com', 'shop.pathwordle.com']
  }
});
```

---

## 🔄 Data Retention Settings

Configure in GA4 Admin:
- **User and event data retention:** 14 months (maximum)
- **Reset timer on new activity:** Enabled

---

## 🚀 Next Steps

1. **Immediate (Today)**
   - [ ] Verify real-time tracking works
   - [ ] Test basic events
   - [ ] Create GA4 dashboard

2. **This Week**
   - [ ] Implement Phase 2 events
   - [ ] Link AdSense account
   - [ ] Set up custom conversions

3. **This Month**
   - [ ] Implement Phase 3 events
   - [ ] Create automated reports
   - [ ] Set up alerts for unusual activity

---

## 📞 Resources

- [GA4 Help Center](https://support.google.com/analytics#topic=9302737)
- [GA4 Demo Account](https://analytics.google.com/demo)
- [Event Builder Tool](https://ga-dev-tools.web.app/ga4-event-builder/)
- [Query Explorer](https://ga-dev-tools.web.app/query-explorer/)

---

**Last Updated:** March 27, 2026
**Measurement ID:** G-FHENCTMKTY
**Status:** ✅ Active and Tracking

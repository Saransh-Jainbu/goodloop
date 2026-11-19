# Milestone 2 Live Deployment UAT & UI QA Notes

**Tester:** Samaksh Tyagi  
**Environment:** iPadOS Safari, `https://goodloop-pi.vercel.app`  
**Date:** 19 November 2026

## Verified End-to-End Flows
- **Landing page (`/`):** Hero, causes strip, and navigation render cleanly.
- **Sign-up (`/signup`):** Volunteer account creation (`E23CSEU1303@bennett.edu.in`) succeeded and redirected with active session.
- **Discovery & Map (`/events`):** All 8 seeded New Delhi events and interactive Leaflet map markers loaded properly.
- **Registration (`/events/[id]`):** Registered for *Community Blood Donation Camp* (Saket); UI updated to "You're registered" and spot count incremented (`3 of 120 spots taken`).

## Minor UI Issues Observed (For Follow-up)
1. **Location filter placeholder (`/events`):** Input placeholder currently reads `e.g. Leeds`, whereas all seeded drives are in New Delhi. Suggest updating to `e.g. Saket, New Delhi`.
2. **Date range input overlap (`/events`):** On tablet viewport width (iPad Safari), the `From` and `To` date input fields slightly overlap horizontally on the right side of the filter bar.
 

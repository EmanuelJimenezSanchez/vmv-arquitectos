<script setup lang="ts">
import AboutSection from '@/components/AboutSection.vue'
import CtaSection from '@/components/CtaSection.vue'
import HeroSection from '@/components/HeroSection.vue'
import PhotoGallerySection from '@/components/PhotoGallerySection.vue'
import ProcessSection from '@/components/ProcessSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import StatsSection from '@/components/StatsSection.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheNavbar from '@/components/TheNavbar.vue'
</script>

<template>
  <TheNavbar />
  <main>
    <HeroSection />
    <StatsSection />
    <AboutSection />
    <!-- <PhotoGallerySection /> -->
    <ServicesSection />
    
    <ProcessSection />
    <ProjectsSection />
    <TestimonialsSection />
    <CtaSection />
  </main>
  <TheFooter />
</template>

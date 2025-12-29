import { defineClientConfig } from 'vuepress/client'
import CustomHomeLayout from './layouts/CustomHomeLayout.vue'
import ProjectsLayout from './layouts/ProjectsLayout.vue'
import PostTimelineLayout from './layouts/PostTimelineLayout.vue'
import EssentialHomeLayout from './layouts/EssentialHomeLayout.vue'
import AmadeusGateLayout from './layouts/AmadeusGateLayout.vue'

import CTASection from './components/CTASection.vue'
import AmadeusCard from './components/AmadeusCard.vue'
import AmadeusChaos from './components/AmadeusChaos.vue'
import AmadeusEmergence from './components/AmadeusEmergence.vue'
import AmadeusTerminal from './components/AmadeusTerminal.vue'
import AmadeusNavigator from './components/AmadeusNavigator.vue'
import AmadeusNeuralBg from './components/AmadeusNeuralBg.vue'

export default defineClientConfig({
  layouts: {
    CustomHomeLayout,
    ProjectsLayout,
    PostTimelineLayout,
    EssentialHomeLayout,
    AmadeusGateLayout,
  },
  enhance({ app }) {
    // built-in components
    // app.component('RepoCard', RepoCard)
    // app.component('NpmBadge', NpmBadge)
    // app.component('NpmBadgeGroup', NpmBadgeGroup)
    // app.component('Swiper', Swiper) // you should install `swiper`

    // your custom components
    // app.component('CustomComponent', CustomComponent)
    app.component('CTASection', CTASection)
    app.component('AmadeusCard', AmadeusCard)
    app.component('AmadeusChaos', AmadeusChaos)
    app.component('AmadeusEmergence', AmadeusEmergence)
    app.component('AmadeusTerminal', AmadeusTerminal)
    app.component('AmadeusNavigator', AmadeusNavigator)
    app.component('AmadeusNeuralBg', AmadeusNeuralBg)
  },
})

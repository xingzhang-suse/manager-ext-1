<template>
    <div style="width:100%;margin:20px auto;height:150px">
    <slider ref="slider" :options="options" @slide='slide' @tap='onTap' @init='onInit' style="white-space: unset;">
        <slideritem v-for="(item,index) in someList" :key="index" style="display: block; font-size: 12px;">
            <h5><strong>{{ item.title }}</strong></h5>
            <p style="text-align: left;">{{ item.content }}</p>
            <!-- <ToggleSwitch /> -->
        </slideritem>
        <div slot="loading">loading...</div>
    </slider>
    </div>
</template>
<script>
import { slider, slideritem } from 'vue-concise-slider'
// import ToggleSwitch from '@shell/components/form/ToggleSwitch';

export default {
data () {
   return {
     someList:[
       {
         title: this.t('dashboard.heading.guideline.titles.MAIN_SCORE_NOT_GOOD'),
         content: `${this.t('dashboard.heading.guideline.MAIN_SCORE_NOT_GOOD1')} ${this.t('dashboard.heading.guideline.MAIN_SCORE_FAIR')} ${this.t('dashboard.heading.guideline.MAIN_SCORE_NOT_GOOD2')}`
       },
       {
         title: this.t('dashboard.heading.guideline.titles.SERVICE_EXPOSURE'),
         content: this.t('dashboard.heading.guideline.SERVICE_EXPOSURE')
       },
       {
         title: this.t('dashboard.heading.guideline.titles.INGRESS_EGRESS'),
         content: this.t('dashboard.heading.guideline.INGRESS_EGRESS')
       },
       {
         title: this.t('dashboard.heading.guideline.titles.AUTO_SCAN_OFF'),
         content: this.t('dashboard.heading.guideline.AUTO_SCAN_OFF')
       }
     ],
     options: {
       currentPage: 0,
       loop: true
     }
   }
 },
 components: {
   slider,
   slideritem
 },
 methods: {
    slide (data) {
    console.log(data)
    },
    onTap (data) {
    console.log(data)
    },
    onInit (data) {
    console.log(data)
    }
  }
}
</script>
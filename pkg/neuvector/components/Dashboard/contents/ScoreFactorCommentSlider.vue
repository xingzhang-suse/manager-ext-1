<template>
    <div style="width:100%;margin:20px auto;height:150px">
    <slider ref="slider" :options="options" @slide='slide' @tap='onTap' @init='onInit' style="white-space: unset;">
        <slideritem v-for="(item,index) in instructionList" :key="index" style="display: block; font-size: 12px;">
          <div v-if="item.type === 'score'">
            <h5><strong>{{ item.title }}</strong></h5>
            <p :style="rancherTheme === 'light' ? 'color: #888' : 'color: #fff' + ' text-align: left;'">
              <ScoreInstruction :score="score" />
            </p>
          </div>
          <div v-else-if="item.type === 'vulnerabilities'">
            <h5><strong>{{ item.title }}</strong></h5>
            <VulnerabilitiesInstruction/>
          </div>
          <div v-else>
            <h5><strong>{{ item.title }}</strong></h5>
            <p :style="rancherTheme === 'light' ? 'color: #888' : 'color: #fff' + ' text-align: left;'">{{ item.content }}</p>
          </div>
        </slideritem>
        <div slot="loading">loading...</div>
    </slider>
    </div>
</template>
<script>
import { slider, slideritem } from 'vue-concise-slider'
import ScoreInstruction from './ScoreInstruction';
import VulnerabilitiesInstruction from './VulnerabilitiesInstruction';
// import ToggleSwitch from '@shell/components/form/ToggleSwitch';

export default {
data () {
   return {
     options: {
       currentPage: 0,
       loop: true
     }
   }
 },
 computed: {
  instructionList: function() {
    return [
       {
         type: 'score',
         title: this.t('dashboard.heading.guideline.titles.MAIN_SCORE_NOT_GOOD'),
       },
       {
         type: 'services',
         title: this.t('dashboard.heading.guideline.titles.SERVICE_EXPOSURE'),
         content: this.t('dashboard.heading.guideline.SERVICE_EXPOSURE')
       },
       {
         type: 'exposures',
         title: this.t('dashboard.heading.guideline.titles.INGRESS_EGRESS'),
         content: this.t('dashboard.heading.guideline.INGRESS_EGRESS')
       },
       {
         type: 'vulnerabilities',
         title: this.t('dashboard.heading.guideline.titles.AUTO_SCAN_OFF')
       }
     ];
  }
 },
 props: {
  rancherTheme: String,
  score: Number
 },
 components: {
   slider,
   slideritem,
   ScoreInstruction,
   VulnerabilitiesInstruction
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
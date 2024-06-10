<script>
    export default {
        components: {
        },
        props: {
            ip: String,
            countryCode: String,
            countryName: String,
            fqdn: String
        },
        computed: {
            imgSrc() {
                return require('../../../assets/img/country-flag/' + this.countryCode.toLowerCase() + '.svg');
            }
        }
    }
</script>

<template>
    <a :href="'https://www.whois.com/whois/' + ip" target="_blank">
        <img
            v-if="countryCode !== '-'"
            :src="imgSrc"
            width="16px" height="12px;"
            class="mr-2"
            style="margin-top: -3px;"
            v-tooltip.top="{
                content: countryName
            }"
        />
        <span v-if="fqdn">
            <span  v-tooltip.top="{
                content: ip
            }">{{ fqdn }}</span>
        </span>
        <span v-else>{{ ip }}</span>
    </a>
</template>
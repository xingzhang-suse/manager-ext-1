<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    export default {
        components: {
            FontAwesomeIcon
        },
        props: {
            secEvent: Object
        }
    };
</script>

<template>
    <div class="row mx-0">
        <div class="col-sm-7 pl-0">
            <div
                class="sec-event-name pl-0 auto-hide"
                v-tooltip.top="{
                    content: secEvent.name,
                }"
                ref="ttSecEventName">
                <FontAwesomeIcon icon="faInfo"/>
                <span
                    :class="'pull-left mt-1 '+ secEvent.type.cssColor"
                    aria-hidden="true">
                </span>
                <strong>{{ secEvent.name }}</strong>
            </div>
        </div>
        <div class="col-sm-3 pl-0 label-wrap">
            <span
                :class="'severity-label ' + secEvent.details.level.cssColor"
            >{{
                t('enum.' + secEvent.details.level.name.toUpperCase())
            }}
            </span>
            <span
                class="severity-label label-primary"
                v-for="label in secEvent.details.labels"
            >{{
                t('securityEvent.label.' + label.toUpperCase())
            }}
            </span>
            <span
                class="severity-label label-muted"
                v-if="secEvent.details.labels.length === 0"
            >{{ t('securityEvent.label.OTHER') }}
            </span>
            <div class="sec-event-right-mask" style="margin-top: -4px;"></div>
        </div>
        <div
            class="col-sm-2 sec-event-time text-muted pl-0 auto-hide"
            v-tooltip.top="{
                content: secEvent.reportedAt,
            }"
            ref="ttSecEventReportedAt">
            <span>{{ secEvent.reportedAt }}</span>
        </div>
    </div>
    
</template>

<style lang="scss">
    @import '../../../../styles/security-events.scss';
    @import '../../../../styles/neuvector.scss';
</style>
<script>
    import Packet from '../../dialogs/Packet';
    import { getPackets, getHost, getWorkload } from '../../../../plugins/security-events-class';
    import { nvVariables, NV_MAP } from '../../../../types/neuvector';
    export default {
        components: {
            Packet
        },
        props: {
            index: Number,
            secEvent: Object,
        },
        computed: {
            isEditRuleAuthorized: function(){
                return true;
            }
        },
        methods: {
            isInternalGroup: function(group){
                return NV_MAP.INTERNAL_GROUPS.includes(group);
            },
            showPacket: async function(threatId, event) {
                try {
                    let packetRes = await getPackets(threatId);
                    nvVariables.packet.value = packetRes.threat.packet;
                    nvVariables.showPacketModal.value = true;
                } catch(error) {
                    console.error(error);
                }
            },
            canShowReviewRule: async function(secEvent) {

            },
            showHostDetails: async function(hostId, event) {
                try {
                    let hostRes = await getHost(hostId);
                    nvVariables.host.value = hostRes.host;
                    nvVariables.showHostInfoModal.value = true;
                } catch(error) {
                    console.error(error);
                }
            },
            showContainerDetails: async function(event, endpoint, hostName) {
                if (
                    endpoint.displayName &&
                    endpoint.displayName.startsWith(NV_MAP.securityEventLocation.HOST)
                ) {
                    this.showHostDetails(ev, endpoint.id.substring(5), hostName);
                    return;
                }
                event.stopPropagation();
                try {
                    let workloadRes = await getWorkload(endpoint.id);
                    nvVariables.workload.value = workloadRes.workload;
                    nvVariables.showWorkloadInfoModal.value = true;
                } catch(error) {
                    console.error(error);
                }
            }
        }
    };
</script>

<template>
    <div>
        <div class="row mr-0">
            <div
                class="col-sm-10 pl-0 auto-hide"
                v-tooltip.top="{
                    content: secEvent.endpoint.source.displayName
                }"
                ref="#ttSecEventSourceName">
                <strong>{{ t('securityEvent.SOURCE') }}:</strong>
                <span>
                    <span
                        v-if="secEvent.endpoint.source.id === 'external'">
                        <a
                            :href="secEvent.endpoint.source.externalURL"
                            target="_blank">
                            <em class="eos-icons icon-18 text-primary">{{
                                secEvent.endpoint.source.icon
                            }}</em>
                            <span>
                                {{ secEvent.endpoint.source.displayName }}
                            </span>
                            <span v-if="secEvent.endpoint.source.ip">(
                                <!-- <app-flag-ip-fqdn
                                    [ip]="secEvent.endpoint.source.ip"
                                    [countryCode]="secEvent.endpoint.source.countryCode"
                                    [countryName]="secEvent.endpoint.source.countryName"
                                    [fqdn]="secEvent.fqdn || ''"
                                >
                                </app-flag-ip-fqdn> -->
                            )</span>
                        </a>
                    </span>
                </span>
                <span v-if="secEvent.endpoint.source.id !== 'external'">
                    <span v-if="secEvent.endpoint.source.domain">
                        <em class="eos-icons icon-18 text-primary">domain</em>
                        <span>
                            {{ secEvent.endpoint.source.domain }}
                        </span>
                    </span>
                    <span v-if="secEvent.endpoint.source.service">
                        <em class="eos-icons icon-18 text-primary">system_group</em>
                        <span>
                            {{ secEvent.endpoint.source.service }}
                        </span>
                    </span>
                    <em class="eos-icons icon-18 text-primary">{{
                        secEvent.endpoint.source.icon
                    }}</em>
                    <span
                        class="link"
                        v-if="
                            secEvent.endpoint.source.hasDetail &&
                            secEvent.endpoint.source.isHyperlinkEnabled
                            "
                            @click="
                            showContainerDetails(
                                $event,
                                secEvent.endpoint.source,
                                secEvent.host_name
                            )
                        ">
                        {{ secEvent.endpoint.source.displayName }}
                    </span>
                    <span
                        v-if="
                            !secEvent.endpoint.source.hasDetail ||
                            !secEvent.endpoint.source.isHyperlinkEnabled
                        ">
                        {{ secEvent.endpoint.source.displayName }}
                    </span>
                </span>
            </div>
            <div
                v-if="secEvent.details.action"
                class="col-sm-2 pl-0 auto-hide"
                v-tooltip.top="{
                    content: secEvent.details.action.name
                }"
                ref="#ttSecEventAction">
                <strong>{{ t('threat.gridHeader.ACTION') }}:</strong>&nbsp;&nbsp;
                    <span :class="'type-label sec-event-action-label px-1 ' + secEvent.details.action.cssColor">
                        {{ secEvent.details.action.name }}
                    </span>
            </div>
        </div>
        <div class="row mr-0">
            <div
                class="col-sm-10 pl-0 auto-hide"
                v-tooltip.top="{
                    content: secEvent.endpoint.destination.displayName
                }"
                ref="#ttSecEventDestinationName">
                <strong>{{ t('securityEvent.DESTINATION') }}:</strong>
                <span>
                    <span
                        v-if="
                            secEvent.endpoint.destination.id === 'external'
                        ">
                        <a
                        :href="secEvent.endpoint.destination.externalURL"
                        target="_blank">
                        <em class="eos-icons icon-18 text-primary">{{
                            secEvent.endpoint.destination.icon
                        }}</em>
                        <span>
                            {{ secEvent.endpoint.destination.displayName }}
                        </span>
                        <span v-if="secEvent.endpoint.destination.ip">(
                            <!-- <app-flag-ip-fqdn
                                [ip]="secEvent.endpoint.destination.ip"
                                [countryCode]="secEvent.endpoint.destination.countryCode"
                                [countryName]="secEvent.endpoint.destination.countryName"
                                [fqdn]="secEvent.fqdn || ''"
                            >
                            </app-flag-ip-fqdn> -->
                        )</span>
                        </a>
                    </span>
                    <span
                        v-if="
                            secEvent.endpoint.destination.id !== 'external'
                        ">
                        <span v-if="secEvent.endpoint.destination.domain">
                            <em class="eos-icons icon-18 text-primary">domain</em>
                            <span>{{
                                secEvent.endpoint.destination.domain
                            }}</span>
                        </span>
                        <span v-if="secEvent.endpoint.destination.service">
                            <em class="eos-icons icon-18 text-primary">system_group</em>
                            <span>
                                {{ secEvent.endpoint.destination.service }}
                            </span>
                        </span>
                        <em class="eos-icons icon-18 text-primary">{{
                            secEvent.endpoint.destination.icon
                        }}</em>
                        <span
                            class="link"
                            v-if="
                                secEvent.endpoint.destination.hasDetail &&
                                secEvent.endpoint.destination.isHyperlinkEnabled
                            "
                            @click="
                                showContainerDetails(
                                    $event,
                                    secEvent.endpoint.destination,
                                    secEvent.host_name
                                )
                        ">
                            {{ secEvent.endpoint.destination.displayName }}
                        </span>
                        <span
                            v-if="
                                !secEvent.endpoint.destination.hasDetail ||
                                !secEvent.endpoint.destination.isHyperlinkEnabled
                        ">
                            {{ secEvent.endpoint.destination.displayName }}
                        </span>
                    </span>
                </span>
            </div>
            <div
                class="mt-1 col-sm-2 padding-0"
                v-if="secEvent.type.name === 'threat'">
                <button
                    v-if="secEvent.details.message.cap_len"
                    class="mat-button btn-sec-event pull-left"
                    @click="showPacket(secEvent.details.id, $event)">
                    <em class="icon-envelope-letter mr-sm"></em>
                    {{ t('threat.VIEW_PACKET') }}
                </button>
            </div>
            <div
                class="mt-1 col-sm-2 padding-0"
                v-if="
                    secEvent.type.name === 'violation' &&
                    isEditRuleAuthorized &&
                    secEvent.reviewRulePermission &&
                    canShowReviewRule(secEvent)
                ">
                <button
                    class="mat-button btn-sec-event pull-left"
                    style="color: #fff"
                    @click="reviewRule('violation', secEvent)">
                    <em class="fa fa-edit fa-lg mr-sm"></em>
                    {{ t('securityEvent.REVIEW_RULE') }}
                </button>
            </div>
            <div
                class="mt-1 col-sm-2 padding-0"
                v-if="
                    secEvent.type.name === 'incident' &&
                    secEvent.details.message.group &&
                    isEditRuleAuthorized &&
                    !isInternalGroup(secEvent.details.message.group) &&
                    secEvent.reviewRulePermission
                ">
                <button
                    class="mat-button btn-sec-event pull-left"
                    style="color: #fff"
                    v-if="
                        secEvent.details.message.messageCategory
                        .toLowerCase()
                        .indexOf('process') >= 0
                    "
                    @click="reviewRule('incident', secEvent)">
                    <em class="fa fa-edit fa-lg mr-sm"></em>
                    {{ t('securityEvent.REVIEW_RULE') }}
                </button>
            </div>
        </div>
    </div>
</template>
<template>
   <div class="text-left">
        <h5><strong>{{ t('dashboard.SSO_MENU') }}</strong></h5>
        <ul style="padding-left: 10px;">
            <li>
                <a :href="ssoLink + 'policy'" target="_blank">
                    <span class="pull-left mr-10">{{ t('dashboard.NETWORK_POLICY') }}</span>
                    <i class="icon icon-external-link icon-12 pull-left"></i>
                </a>
            </li>
            <li>
                <a :href="ssoLink + 'scan'" target="_blank">
                    <span class="pull-left mr-10">{{ t('dashboard.VULNERBILITIES') }}</span>
                    <i class="icon icon-external-link icon-12 pull-left"></i>
                </a>
            </li>
            <li>
                <a :href="ssoLink + 'security-event'" target="_blank">
                    <span class="pull-left mr-10">{{ t('dashboard.SEC_EVENT') }}</span>
                    <i class="icon icon-external-link icon-12 pull-left"></i>
                </a>
            </li>
        </ul>
    </div>
 </template>
 <script>
     export default {
         props: {
             ns: String,
             ssoLink: String
         }
     }
 </script>
 
 <style lang="scss">
    .icon-12 {
        font-size: 12px;
    }
 </style>
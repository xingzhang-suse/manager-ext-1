<template>
   <div >
        <h5 class="text-center"><strong>{{ t('dashboard.SSO_MENU') }}</strong></h5>
        <ul>
            <li>
                <a :href="ssoLink + 'policy'" target="_blank">{{ t('dashboard.NETWORK_POLICY') }}
                    <i class="icon icon-external-link pull-right"></i>
                </a>
            </li>
            <li>
                <a :href="ssoLink + 'scan'" target="_blank">{{ t('dashboard.VULNERBILITIES') }}
                <i class="icon icon-external-link pull-right"></i>
            </a>
            </li>
            <li>
                <a :href="ssoLink + 'security-event'" target="_blank">{{ t('dashboard.SEC_EVENT') }}
                    <i class="icon icon-external-link pull-right"></i>
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
 </style>
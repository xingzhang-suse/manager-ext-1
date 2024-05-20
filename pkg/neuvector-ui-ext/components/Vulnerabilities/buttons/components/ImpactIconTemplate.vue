<script>
import IconApartment from '../../../common/icons/Apartment.vue';
import IconCheckboxBlank from '../../../common/icons/CheckboxBlank.vue';
import IconStorage from '../../../common/icons/Storage.vue';
import IconSystemImage from '../../../common/icons/SystemImage.vue';

export default {
    props: {
        type: String
    },
    components: {
        IconApartment,
        IconCheckboxBlank,
        IconStorage,
        IconSystemImage
    }
}
</script>

<template>
    <div>
        <IconSystemImage v-if="type === 'image'"></IconSystemImage>
        <!-- <i v-if="type === 'image'" class="eos-icons mr-2" style="font-size: 15px">
            system_image
        </i> -->
        <IconCheckboxBlank v-else-if="type === 'workload'"></IconCheckboxBlank>
        <!-- <i v-else-if="type === 'workload'"
            class="eos-icons mr-2"
            style="font-size: 15px">
            check_box_blank
        </i> -->
        <IconStorage v-else-if="type === 'node'"></IconStorage>
        <!-- <i v-else-if="type === 'node'" class="eos-icons mr-2" style="font-size: 15px">
            storage
        </i> -->
        <IconApartment v-else-if="type === 'platform'"></IconApartment>
        <!-- <i v-else-if="type === 'platform'"
            class="eos-icons mr-2"
            style="font-size: 15px">
            apartment
        </i> -->
    </div>
</template>
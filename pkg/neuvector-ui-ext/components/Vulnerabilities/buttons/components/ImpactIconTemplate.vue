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
        <IconCheckboxBlank v-else-if="type === 'workload'"></IconCheckboxBlank>
        <IconStorage v-else-if="type === 'node'"></IconStorage>
        <IconApartment v-else-if="type === 'platform'"></IconApartment>
    </div>
</template>
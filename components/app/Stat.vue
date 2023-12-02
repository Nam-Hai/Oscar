<template></template>

<script lang="ts" setup>
//@ts-ignore
import Stats from 'stats.js'

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
document.body.appendChild(stats.dom);
function animate() {
    // monitored code goes here
    stats.end();
    stats.begin();
}
useRaf(animate)

</script>

<style lang="scss" scoped></style>


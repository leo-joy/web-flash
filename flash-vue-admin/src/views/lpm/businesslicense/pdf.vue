<template>
  <div class="pdf">
    <p class="arrow">
      <span class="turn" :class="{grey: currentPage==1}" @click="changePdfPage(0)">Preview</span>
      {{ currentPage }} / {{ pageCount }}
      <span
        class="turn"
        :class="{grey: currentPage==pageCount}"
        @click="changePdfPage(1)"
      >Next</span>
    </p>
    <pdf :src="src" />
    <!-- <iframe :src="src" frameborder="0" style="width: 100%; height: 100%"></iframe> -->
  </div>
</template>
<script src="./pdf.js"></script>

<template>
  <div>
    <ul v-if="posts.length">
      <li v-for="post in posts" :key="post.id">
        <div class="clickable-div" @click="() => explainTitle(post)">
          {{ post.value }}
        </div>

      </li>
    </ul>
    <p v-else>Loading...</p>
  </div>
  <p>{{ displayText }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);
const resText = ref(""); // Holds the full response text
const displayText = ref(""); // Used for the auto-typing effect
const typingSpeed = 10; // Milliseconds


// const URL = process.env.AI_URL;

onMounted(async () => {

  try {
    const title = "Customer Service Principles";
    const response = await axios.post("http://localhost:8080/", {
      title: title
    });
    posts.value = response.data;
    // console.log(posts.value);
  } catch (error) {
    console.error('There was an error fetching the posts:', error);
  }
});


async function explainTitle(post) {
  try {
    const response = await axios.post("http://localhost:8080/explain/title", {
      title: post.value
    });
    resText.value = response.data;
    autoTypeResponse(resText.value);
  } catch (error) {
    console.error('There was an error:', error);
  }
}
function autoTypeResponse(fullText) {
  displayText.value = ""; // Clear previous text
  let index = 0;
  const typeChar = () => {
    if (index < fullText.length) {
      displayText.value += fullText[index];
      index++;
      setTimeout(typeChar, typingSpeed);
    }
  };
  typeChar();
}
</script>

<style>
/* Optionally add styles for your clickable divs */
.clickable-div {
  cursor: pointer;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}
</style>
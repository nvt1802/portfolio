<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement | null>(null)

const execCommand = (command: string, value: string | undefined = undefined) => {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
  updateContent()
}

const updateContent = () => {
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
}

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  if (editorRef.value && newVal !== editorRef.value.innerHTML) {
    editorRef.value.innerHTML = newVal || ''
  }
})

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue || ''
  }
})
</script>

<template>
  <div class="border border-[color:var(--border-color)] rounded-md overflow-hidden bg-black/20 focus-within:border-[color:var(--primary)] transition-colors">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-1 p-2 border-b border-[color:var(--border-color)] bg-black/40">
      <button type="button" @click.prevent="execCommand('bold')" class="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors" title="In đậm">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.6 11.8c1-.7 1.6-1.8 1.6-3 0-2.3-1.9-4.1-4.2-4.1H7v14.6h6.8c2.6 0 4.7-2.1 4.7-4.7 0-1.7-.9-3.2-2.3-4.1zM9.8 6.9h2.8c1.1 0 2 .9 2 2s-.9 2-2 2H9.8v-4zm3.2 10.3H9.8v-4.4h3.2c1.2 0 2.2 1 2.2 2.2s-1 2.2-2.2 2.2z"/></svg>
      </button>
      <button type="button" @click.prevent="execCommand('italic')" class="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors" title="In nghiêng">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 5v3h2.2l-3.4 8H6v3h8v-3h-2.2l3.4-8H18V5h-8z"/></svg>
      </button>
      <button type="button" @click.prevent="execCommand('underline')" class="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors" title="Gạch chân">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17c3.3 0 6-2.7 6-6V3h-2.5v8c0 1.9-1.6 3.5-3.5 3.5S8.5 12.9 8.5 11V3H6v8c0 3.3 2.7 6 6 6zm-7 2v1.5h14V19H5z"/></svg>
      </button>
      <div class="w-px h-6 bg-white/20 mx-1 self-center"></div>
      <button type="button" @click.prevent="execCommand('insertUnorderedList')" class="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors" title="Danh sách">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 5h14v2H7V5zm0 8h14v-2H7v2zm0 8h14v-2H7v2zM4 4.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5S4.8 4.5 4 4.5zm0 8c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm0 8c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z"/></svg>
      </button>
      <button type="button" @click.prevent="execCommand('insertOrderedList')" class="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors" title="Danh sách số">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 13h14v-2H7v2zm0 6h14v-2H7v2zm0-12v2h14V7H7zM3 13.5h2v-1.5H3v1.5zm0 6h2v-1.5H3v1.5zM3 7h2V5.5H3V7z"/></svg>
      </button>
    </div>
    
    <!-- Editor content -->
    <div 
      ref="editorRef" 
      class="p-4 min-h-[150px] max-h-[400px] overflow-y-auto text-[color:var(--text-primary)] outline-none prose prose-invert max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-2"
      contenteditable="true" 
      @input="updateContent"
      @blur="updateContent"
    ></div>
  </div>
</template>

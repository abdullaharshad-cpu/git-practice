import { create } from 'zustand';

export const usePostStore = create((set, get) => ({
  posts: [],
  // We store comments in an object where the key is the postId 
  // e.g., { 1: [comment1, comment2], 2: [comment3] }
  commentsByPost: {},
  
  setInitialPosts: (apiPosts) => {
    if (get().posts.length === 0) {
      set({ posts: apiPosts });
    }
  },

  // Initialize comments array for a specific post if not already loaded
  setInitialComments: (postId, apiComments) => {
    const currentComments = get().commentsByPost[postId];
    if (!currentComments) {
      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: apiComments
        }
      }));
    }
  },

  createPost: (title, body, userEmail) => {
    const newPost = { id: Date.now(), title, body, userEmail, userId: 999 };
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },

  editPost: (postId, updatedTitle, updatedBody, userEmail) => {
    const { posts } = get();
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost || targetPost.userEmail !== userEmail) {
      throw new Error("Unauthorized");
    }
    set((state) => ({
      posts: state.posts.map((p) => p.id === postId ? { ...p, title: updatedTitle, body: updatedBody } : p),
    }));
  },

  deletePost: (postId, userEmail) => {
    const { posts } = get();
    const targetPost = posts.find((p) => p.id === postId);
    if (targetPost.userEmail && targetPost.userEmail !== userEmail) {
      throw new Error("Unauthorized");
    }
    set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) }));
  },

  // --- COMMENTS ACTIONS ---
  
  addComment: (postId, body, userEmail) => {
    const newComment = {
      id: Date.now(),
      postId,
      body,
      email: userEmail, // Tagging ownership to the logged-in user
      name: userEmail.split('@')[0] // Dummy name from email prefix
    };

    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: [newComment, ...(state.commentsByPost[postId] || [])]
      }
    }));
  },

  editComment: (postId, commentId, updatedBody, userEmail) => {
    const postComments = get().commentsByPost[postId] || [];
    const targetComment = postComments.find(c => c.id === commentId);

    if (!targetComment || targetComment.email !== userEmail) {
      throw new Error("Unauthorized: You can only edit your own comments.");
    }

    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: postComments.map(c => c.id === commentId ? { ...c, body: updatedBody } : c)
      }
    }));
  },

  deleteComment: (postId, commentId, userEmail) => {
    const postComments = get().commentsByPost[postId] || [];
    const targetComment = postComments.find(c => c.id === commentId);

    // Guard: Only allow deletion if they made it
    if (targetComment.email && targetComment.email !== userEmail) {
      throw new Error("Unauthorized: You can only delete your own comments.");
    }

    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: postComments.filter(c => c.id !== commentId)
      }
    }));
  }
}));
import { useState, useEffect } from 'react';
import { usePostStore } from '../store/postStore';

export default function CommentSection({ postId, currentUserEmail }) {
  const { commentsByPost, setInitialComments, addComment, editComment, deleteComment } = usePostStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  const postComments = commentsByPost[postId] || [];

  // Fetch comments from JSONPlaceholder ONLY when the user expands this section
  useEffect(() => {
    if (isOpen && postComments.length === 0) {
      // If it's a custom post made by the user, don't hit the API (it doesn't exist on server)
      if (postId > 1000) return; 

      fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        .then(res => res.json())
        .then(data => {
          setInitialComments(postId, data.slice(0, 3)); // Grab 3 comments for layout neatness
        })
        .catch(err => console.error(err));
    }
  }, [isOpen, postId, postComments.length, setInitialComments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (editingCommentId) {
      editComment(postId, editingCommentId, commentText, currentUserEmail);
      setEditingCommentId(null);
    } else {
      addComment(postId, commentText, currentUserEmail);
    }
    setCommentText('');
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setCommentText(comment.body);
  };

  return (
    <div className="mt-4 border-t border-slate-800/60 pt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-indigo-400"
      >
        {isOpen ? '🔼 Hide Comments' : `💬 Show Comments (${postComments.length || 'Click to Load'})`}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 pl-2 transition-all">
          
          {/* List of Comments */}
          <div className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
            {postComments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-slate-800/40 bg-slate-950/80 p-3 text-xs shadow-sm">
                <div className="mb-1 flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-indigo-300">{comment.name || comment.email}</span>
                  {comment.email === currentUserEmail && (
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(comment)} className="hover:text-indigo-400 hover:underline">Edit</button>
                      <button onClick={() => deleteComment(postId, comment.id, currentUserEmail)} className="hover:text-rose-400 hover:underline">Delete</button>
                    </div>
                  )}
                </div>
                <p className="text-slate-300 capitalize">{comment.body}</p>
              </div>
            ))}
          </div>

          {/* Post/Edit Comment Form */}
          <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
            <input 
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950/90 p-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
            <button 
              type="submit"
              className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              {editingCommentId ? 'Save' : 'Reply'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
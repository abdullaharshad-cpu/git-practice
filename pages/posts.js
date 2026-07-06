import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import { usePostStore } from '../store/postStore';
import CommentSection from '../components/CommentSection'; // Import the new sub-component

export default function PostsPage({ initialApiPosts }) {
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const { posts, setInitialPosts, createPost, editPost, deletePost } = usePostStore();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      router.replace('/auth');
    } else {
      setInitialPosts(initialApiPosts);
    }
  }, [currentUser, router, initialApiPosts, setInitialPosts]);

  if (!currentUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !body.trim()) {
      setError('Both fields are required.');
      return;
    }

    try {
      if (editingPostId) {
        editPost(editingPostId, title, body, currentUser.email);
        setEditingPostId(null);
      } else {
        createPost(title, body, currentUser.email);
      }
      setTitle('');
      setBody('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setBody(post.body);
  };

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden bg-transparent p-4 text-slate-100 sm:p-6"
      style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-0 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-[-5%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto mb-8 flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">PostHub Dashboard</h1>
          <p className="text-sm text-slate-400">
            Welcome, <span className="font-semibold text-indigo-400">{currentUser.name}</span>
          </p>
        </div>
        <button 
          onClick={() => { logout(); router.push('/auth'); }}
          className="rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2 text-sm font-medium text-slate-200 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-950/40 hover:text-rose-300"
        >
          Logout
        </button>
      </header>

      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* LEFT COLUMN: Main Feed */}
        <section className="lg:col-span-7 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              🌐 <span className="tracking-tight">Global Post Feed</span>
            </h2>
            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Live
            </span>
          </div>
          
          <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-2">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
                No posts yet. Start the conversation from the form on the right.
              </div>
            ) : posts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-slate-700/80">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold capitalize text-slate-100">{post.title}</h3>
                  <div className="flex shrink-0 gap-2">
                    {(!post.userEmail || post.userEmail === currentUser.email) && (
                      <>
                        <button 
                          onClick={() => handleEditClick(post)}
                          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deletePost(post.id, currentUser.email)}
                          className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{post.body}</p>
                {post.userEmail && (
                  <span className="mt-3 inline-block rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                    Your Created Post
                  </span>
                )}

                {/* Injecting our isolated comment structure right inside each post element */}
                <CommentSection postId={post.id} currentUserEmail={currentUser.email} />

              </div>
            ))}
          </div>
        </section>

        {/* RIGHT COLUMN: Action panel */}
        <section className="lg:col-span-5">
          <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-md">
            <h2 className="mb-4 text-lg font-bold text-white">
              {editingPostId ? '🔧 Modify Existing Post' : '📝 Compose New Post'}
            </h2>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Post Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Content Body</label>
                <textarea 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="What is on your mind?"
                  rows="6"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 hover:from-indigo-600 hover:to-violet-700 transition-all"
                >
                  {editingPostId ? 'Save Changes' : 'Publish to Feed'}
                </button>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={() => { setEditingPostId(null); setTitle(''); setBody(''); }}
                    className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json();
    return {
      props: {
        initialApiPosts: data.slice(0, 10),
      },
    };
  } catch (error) {
    return {
      props: {
        initialApiPosts: [],
      },
    };
  }
}
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit3, Eye, CheckCircle, AlertCircle, HelpCircle, Save, X, Search, Filter, BookOpen } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://content-management-system-2-he9n.onrender.com/api';

const QuizBuilder = () => {
  const { user, isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Active quiz being edited or created
  const [isEditing, setIsEditing] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
    },
  ]);

  // Quiz Modal View
  const [viewingQuiz, setViewingQuiz] = useState(null);

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('lumen_token');
      const res = await fetch(`${API_URL}/quizzes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok && data.quizzes) {
        setQuizzes(data.quizzes);
      }
    } catch (err) {
      console.error('Fetch quizzes error:', err);
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setQuizId(null);
    setQuizTitle('');
    setQuizDescription('');
    setQuestions([
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
      },
    ]);
  };

  // Add Question
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
      },
    ]);
  };

  // Remove Question
  const handleRemoveQuestion = (idx) => {
    if (questions.length === 1) {
      setError('Quiz must have at least one question');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Question Field Handlers
  const handleQuestionTextChange = (idx, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx].question = text;
      return copy;
    });
  };

  const handleOptionChange = (qIdx, optIdx, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].options[optIdx] = text;
      return copy;
    });
  };

  const handleCorrectAnswerChange = (qIdx, answer) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].correctAnswer = answer;
      return copy;
    });
  };

  const handleExplanationChange = (qIdx, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].explanation = text;
      return copy;
    });
  };

  // Submit/Save Quiz
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!quizTitle.trim()) {
      setError('Quiz title is required');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        setError(`All 4 options are required for Question ${i + 1}`);
        return;
      }
      if (new Set(q.options.map((o) => o.trim())).size !== 4) {
        setError(`Options must be unique for Question ${i + 1}`);
        return;
      }
      if (!q.correctAnswer.trim()) {
        setError(`Please select a correct answer for Question ${i + 1}`);
        return;
      }
    }

    try {
      const token = localStorage.getItem('lumen_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        title: quizTitle.trim(),
        description: quizDescription.trim(),
        questions,
      };

      let res;
      if (isEditing && quizId) {
        res = await fetch(`${API_URL}/quizzes/${quizId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_URL}/quizzes`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save quiz');
      }

      setSuccessMsg(isEditing ? 'Quiz updated successfully!' : 'Quiz created successfully!');
      resetForm();
      fetchQuizzes();
    } catch (err) {
      console.error('Save quiz error:', err);
      setError(err.message || 'Failed to save quiz');
    }
  };

  const handleEditClick = (quiz) => {
    setIsEditing(true);
    setQuizId(quiz._id || quiz.id);
    setQuizTitle(quiz.title || '');
    setQuizDescription(quiz.description || '');
    setQuestions(
      quiz.questions && quiz.questions.length > 0
        ? quiz.questions.map((q) => ({
            question: q.question || '',
            options: q.options || ['', '', '', ''],
            correctAnswer: q.correctAnswer || '',
            explanation: q.explanation || '',
          }))
        : [
            {
              question: '',
              options: ['', '', '', ''],
              correctAnswer: '',
              explanation: '',
            },
          ]
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      const token = localStorage.getItem('lumen_token');
      const res = await fetch(`${API_URL}/quizzes/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setSuccessMsg('Quiz deleted successfully');
        fetchQuizzes();
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete quiz');
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch =
      q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Assessment Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Quiz Builder & Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Design interactive knowledge checkpoints and concept verification quizzes for readers.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quiz Creation / Editing Form */}
      <div className="enterprise-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Quiz' : 'Create New Knowledge Checkpoint'}
          </h2>
          {isEditing && (
            <button
              onClick={resetForm}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSaveQuiz} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 font-mono">
                Quiz Title
              </label>
              <input
                type="text"
                placeholder="e.g. CRISPR Cas9 Molecular Mechanics"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="enterprise-input w-full px-3.5 py-2.5 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 font-mono">
                Description / Overview
              </label>
              <input
                type="text"
                placeholder="Brief summary of concepts tested in this quiz..."
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="enterprise-input w-full px-3.5 py-2.5"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Questions ({questions.length})
              </h3>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-2 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                    Question {qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-rose-600 dark:text-rose-400 hover:text-rose-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Enter question prompt..."
                    value={q.question}
                    onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                    className="enterprise-input w-full px-3.5 py-2"
                  />
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono">Option {optIdx + 1}</span>
                        <label className="inline-flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctAnswer === opt && opt.trim() !== ''}
                            onChange={() => handleCorrectAnswerChange(qIdx, opt)}
                            className="accent-blue-600"
                          />
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Mark Correct</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        className={`enterprise-input w-full px-3 py-2 ${
                          q.correctAnswer === opt && opt.trim() !== ''
                            ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                            : ''
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-mono">
                    Explanation (Optional context for readers)
                  </label>
                  <input
                    type="text"
                    placeholder="Explain why the marked answer is correct..."
                    value={q.explanation || ''}
                    onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                    className="enterprise-input w-full px-3 py-2"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Quiz' : 'Save Quiz'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quiz List & Filtering Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 enterprise-card p-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quizzes by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="enterprise-input w-full pl-9 pr-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="enterprise-input px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition shrink-0"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filteredQuizzes.length === 0 && !loading && (
          <div className="enterprise-card p-12 text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No quizzes found.</p>
            <p className="text-xs text-slate-400">Try changing your search or filter settings.</p>
          </div>
        )}

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz._id || quiz.id} className="enterprise-card p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                    {quiz.title}
                  </h4>
                  <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-200/60 dark:border-blue-800/60 shrink-0 font-mono">
                    {quiz.status || 'approved'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                  {quiz.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {quiz.questions?.length || 0} Questions
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingQuiz(quiz)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => handleEditClick(quiz)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(quiz._id || quiz.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Viewing Modal */}
      {viewingQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{viewingQuiz.title}</h3>
              <button onClick={() => setViewingQuiz(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{viewingQuiz.description}</p>

            <div className="space-y-3">
              {viewingQuiz.questions?.map((q, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Q{idx + 1}: {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options?.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-xl text-xs border ${
                          opt === q.correctAnswer
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizBuilder;

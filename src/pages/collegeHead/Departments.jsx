import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  X,
  Check,
  Filter,
  Download,
  Upload,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  Mail,
  Phone,
  Building2,
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Image,
  Mic,
  Archive,
  Star,
  Bell,
  MoreHorizontal,
  Reply,
  Forward,
  Copy,
  Trash,
  Pin,
  AlertCircle
} from "lucide-react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/departmentApi";
import "./Departments.css";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  
  // Messaging states
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedDeptForMessage, setSelectedDeptForMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageThread, setMessageThread] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [messageSearch, setMessageSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, unread, starred, archived

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    head: "",
    email: "",
    phone: "",
    established: "",
    students: 0,
    faculty: 0
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterHead, setFilterHead] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Load departments
  useEffect(() => {
    fetchDepartments();
    loadMessages();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Message functions
  const loadMessages = () => {
    // Load messages from localStorage or API
    const savedMessages = localStorage.getItem("department_messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Sample messages
      const sampleMessages = [
        {
          id: 1,
          departmentId: 1,
          from: "Dr. John Doe",
          fromEmail: "john.doe@cs.edu",
          subject: "Budget Meeting Request",
          message: "I would like to schedule a budget meeting for next week to discuss the department's funding requirements for the upcoming semester.",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: false,
          starred: false,
          archived: false,
          attachments: [],
          replies: []
        },
        {
          id: 2,
          departmentId: 1,
          from: "Prof. Jane Smith",
          fromEmail: "jane.smith@eng.edu",
          subject: "Faculty Recruitment Update",
          message: "The faculty recruitment committee has shortlisted 5 candidates for the professor position. Please review their profiles at your earliest convenience.",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: true,
          archived: false,
          attachments: ["candidates_list.pdf"],
          replies: [
            {
              id: 101,
              from: "College Head",
              message: "Thank you for the update. I will review the profiles by tomorrow.",
              timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: 3,
          departmentId: 2,
          from: "Dr. Robert Johnson",
          fromEmail: "robert.johnson@bus.edu",
          subject: "Research Grant Proposal",
          message: "Our department has submitted a research grant proposal for $500,000. Please approve the budget allocation.",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          read: false,
          starred: false,
          archived: false,
          attachments: ["grant_proposal.pdf", "budget.xlsx"],
          replies: []
        }
      ];
      setMessages(sampleMessages);
      localStorage.setItem("department_messages", JSON.stringify(sampleMessages));
    }
  };

  const saveMessages = (updatedMessages) => {
    setMessages(updatedMessages);
    localStorage.setItem("department_messages", JSON.stringify(updatedMessages));
  };

  const handleOpenMessageModal = (dept) => {
    setSelectedDeptForMessage(dept);
    const deptMessages = messages.filter(m => m.departmentId === dept.id);
    setMessageThread(deptMessages);
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      departmentId: selectedDeptForMessage.id,
      from: "College Head",
      fromEmail: "head@college.edu",
      subject: "New Message",
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      starred: false,
      archived: false,
      attachments: attachments,
      replies: []
    };

    const updatedMessages = [...messages, messageData];
    saveMessages(updatedMessages);
    
    // Update thread
    setMessageThread([...messageThread, messageData]);
    setNewMessage("");
    setAttachments([]);
  };

  const handleReplyToMessage = (parentMessage) => {
    const replyText = prompt("Enter your reply:");
    if (replyText) {
      const updatedMessages = messages.map(msg => {
        if (msg.id === parentMessage.id) {
          return {
            ...msg,
            replies: [...msg.replies, {
              id: Date.now(),
              from: "College Head",
              message: replyText,
              timestamp: new Date().toISOString()
            }]
          };
        }
        return msg;
      });
      saveMessages(updatedMessages);
      
      // Update thread
      const updatedThread = updatedMessages.filter(m => m.departmentId === selectedDeptForMessage.id);
      setMessageThread(updatedThread);
    }
  };

  const handleStarMessage = (messageId) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    );
    saveMessages(updatedMessages);
    
    // Update thread
    const updatedThread = updatedMessages.filter(m => m.departmentId === selectedDeptForMessage.id);
    setMessageThread(updatedThread);
  };

  const handleArchiveMessage = (messageId) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, archived: !msg.archived } : msg
    );
    saveMessages(updatedMessages);
    
    // Update thread
    const updatedThread = updatedMessages.filter(m => m.departmentId === selectedDeptForMessage.id);
    setMessageThread(updatedThread);
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      saveMessages(updatedMessages);
      
      // Update thread
      const updatedThread = updatedMessages.filter(m => m.departmentId === selectedDeptForMessage.id);
      setMessageThread(updatedThread);
    }
  };

  const handleMarkAsRead = (messageId) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    saveMessages(updatedMessages);
    
    // Update thread
    const updatedThread = updatedMessages.filter(m => m.departmentId === selectedDeptForMessage.id);
    setMessageThread(updatedThread);
  };

  const getUnreadCount = (deptId) => {
    return messages.filter(m => m.departmentId === deptId && !m.read && !m.archived).length;
  };

  const handleAdd = () => {
    setModalMode("add");
    setFormData({
      name: "",
      code: "",
      head: "",
      email: "",
      phone: "",
      established: "",
      students: 0,
      faculty: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (dept) => {
    setModalMode("edit");
    setFormData(dept);
    setIsModalOpen(true);
  };

  const handleView = (dept) => {
    setModalMode("view");
    setFormData(dept);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        await fetchDepartments();
        alert("Department deleted successfully!");
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Error deleting department");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await createDepartment(formData);
        await fetchDepartments();
        alert("Department added successfully!");
      } else {
        await updateDepartment(formData._id || formData.id, formData);
        await fetchDepartments();
        alert("Department updated successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving department:", error);
      alert("Error saving department");
    }
  };

  // Filter and search
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterHead || dept.code === filterHead;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Code", "Description"];
    const csvData = departments.map(dept => [
      dept.id, dept.name, dept.code, dept.description
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "departments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getUniqueCodes = () => {
    return [...new Set(departments.map(dept => dept.code))];
  };

  return (
    <div className="departments-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage college departments and their information</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={exportToCSV}>
            <Download size={18} />
            Export
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={18} />
            Add Department
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by department name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>

        {showFilters && (
          <div className="filters-panel">
            <select 
              value={filterHead}
              onChange={(e) => setFilterHead(e.target.value)}
              className="filter-select"
            >
              <option value="">All Codes</option>
              {getUniqueCodes().map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <button 
              className="clear-filters"
              onClick={() => {
                setFilterHead("");
                setSearchTerm("");
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-item">
          <div className="stat-icon" style={{ background: "#667eea15", color: "#667eea" }}>
            <Building2 size={20} />
          </div>
          <div>
            <div className="stat-value">{departments.length}</div>
            <div className="stat-label">Total Departments</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon" style={{ background: "#48bb7815", color: "#48bb78" }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-value">
              {departments.reduce((sum, dept) => sum + (dept.students || 0), 0).toLocaleString()}
            </div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon" style={{ background: "#ed893615", color: "#ed8936" }}>
            <MessageCircle size={20} />
          </div>
          <div>
            <div className="stat-value">
              {messages.filter(m => !m.read).length}
            </div>
            <div className="stat-label">Unread Messages</div>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading departments...</p>
          </div>
        ) : (
          <>
            <table className="departments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Code</th>
                  <th>Contact</th>
                  <th>Established</th>
                  <th>Students</th>
                  <th>Faculty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((dept) => (
                  <tr key={dept._id || dept.id}>
                    <td className="id-cell">#{dept.id}</td>
                    <td className="dept-name-cell">
                      <div className="dept-name-wrapper">
                        <div className="dept-icon">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div className="dept-name">{dept.name}</div>
                          {getUnreadCount(dept.id) > 0 && (
                            <div className="unread-badge">
                              {getUnreadCount(dept.id)} new
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="code-badge">{dept.code}</div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div><Mail size={12} /> {dept.email}</div>
                        <div><Phone size={12} /> {dept.phone}</div>
                      </div>
                    </td>
                    <td>{dept.established}</td>
                    <td className="student-count">{(dept.students || 0).toLocaleString()}</td>
                    <td>{(dept.faculty || 0).toLocaleString()}</td>
                    <td className="actions-cell">
                      <button 
                        className="action-btn message"
                        onClick={() => handleOpenMessageModal(dept)}
                        title="Messages"
                      >
                        <MessageCircle size={16} />
                        {getUnreadCount(dept.id) > 0 && (
                          <span className="message-count">{getUnreadCount(dept.id)}</span>
                        )}
                      </button>
                      <button 
                        className="action-btn view"
                        onClick={() => handleView(dept)}
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEdit(dept)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(dept._id || dept.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {filteredDepartments.length === 0 && (
              <div className="empty-state">
                <Building2 size={48} />
                <h3>No departments found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message Modal */}
      {isMessageModalOpen && selectedDeptForMessage && (
        <div className="modal-overlay" onClick={() => setIsMessageModalOpen(false)}>
          <div className="modal message-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="message-header-info">
                <MessageCircle size={20} />
                <div>
                  <h2>Messages - {selectedDeptForMessage.name}</h2>
                  <p>{selectedDeptForMessage.code}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setIsMessageModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="message-container">
              {/* Message Sidebar */}
              <div className="message-sidebar">
                <div className="message-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                  />
                </div>
                <div className="message-filters">
                  <button 
                    className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterType('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-chip ${filterType === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilterType('unread')}
                  >
                    Unread
                  </button>
                  <button 
                    className={`filter-chip ${filterType === 'starred' ? 'active' : ''}`}
                    onClick={() => setFilterType('starred')}
                  >
                    Starred
                  </button>
                </div>
                <div className="message-list">
                  {messageThread
                    .filter(msg => {
                      if (filterType === 'unread') return !msg.read;
                      if (filterType === 'starred') return msg.starred;
                      return true;
                    })
                    .filter(msg => 
                      msg.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
                      msg.message.toLowerCase().includes(messageSearch.toLowerCase())
                    )
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map(msg => (
                      <div 
                        key={msg.id} 
                        className={`message-item ${!msg.read ? 'unread' : ''}`}
                      >
                        <div className="message-item-header">
                          <div className="message-sender">{msg.from}</div>
                          <div className="message-actions">
                            <button onClick={() => handleStarMessage(msg.id)}>
                              <Star size={14} className={msg.starred ? 'starred' : ''} />
                            </button>
                            <button onClick={() => handleArchiveMessage(msg.id)}>
                              <Archive size={14} />
                            </button>
                            <div className="dropdown">
                              <button className="dropdown-trigger">
                                <MoreHorizontal size={14} />
                              </button>
                              <div className="dropdown-menu">
                                <button onClick={() => handleReplyToMessage(msg)}>
                                  <Reply size={14} /> Reply
                                </button>
                                <button onClick={() => handleMarkAsRead(msg.id)}>
                                  <Check size={14} /> Mark as read
                                </button>
                                <button onClick={() => handleDeleteMessage(msg.id)}>
                                  <Trash size={14} /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="message-subject">{msg.subject}</div>
                        <div className="message-preview">
                          {msg.message.substring(0, 100)}...
                        </div>
                        <div className="message-time">
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Message Content */}
              <div className="message-content-area">
                {messageThread.length > 0 ? (
                  <div className="message-thread">
                    {messageThread
                      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                      .map(msg => (
                        <div key={msg.id} className="message-bubble">
                          <div className="message-bubble-header">
                            <div className="sender-info">
                              <strong>{msg.from}</strong>
                              <span>{new Date(msg.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="bubble-actions">
                              <button onClick={() => handleReplyToMessage(msg)}>
                                <Reply size={14} />
                              </button>
                              <button onClick={() => handleStarMessage(msg.id)}>
                                <Star size={14} className={msg.starred ? 'starred' : ''} />
                              </button>
                            </div>
                          </div>
                          <div className="message-subject-line">
                            <strong>Subject:</strong> {msg.subject}
                          </div>
                          <div className="message-body">
                            {msg.message}
                          </div>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="message-attachments">
                              <Paperclip size={14} />
                              {msg.attachments.map((att, idx) => (
                                <span key={idx} className="attachment">{att}</span>
                              ))}
                            </div>
                          )}
                          {msg.replies && msg.replies.length > 0 && (
                            <div className="message-replies">
                              <div className="replies-header">
                                <Reply size={12} /> Replies
                              </div>
                              {msg.replies.map(reply => (
                                <div key={reply.id} className="reply-item">
                                  <div className="reply-header">
                                    <strong>{reply.from}</strong>
                                    <span>{new Date(reply.timestamp).toLocaleString()}</span>
                                  </div>
                                  <div className="reply-message">{reply.message}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="no-messages">
                    <MessageCircle size={48} />
                    <h3>No messages yet</h3>
                    <p>Send a message to this department</p>
                  </div>
                )}

                {/* Compose Message */}
                <div className="compose-area">
                  <div className="compose-toolbar">
                    <button title="Attach file">
                      <Paperclip size={18} />
                    </button>
                    <button title="Add emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <Smile size={18} />
                    </button>
                    <button title="Add image">
                      <Image size={18} />
                    </button>
                    <button title="Voice message">
                      <Mic size={18} />
                    </button>
                  </div>
                  <textarea
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button 
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === "add" && "Add New Department"}
                {modalMode === "edit" && "Edit Department"}
                {modalMode === "view" && "Department Details"}
              </h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            {modalMode === "view" ? (
              <div className="modal-body view-mode">
                <div className="detail-group">
                  <label>Department Name</label>
                  <p>{formData.name}</p>
                </div>
                <div className="detail-group">
                  <label>Department Code</label>
                  <p>{formData.code}</p>
                </div>
                <div className="detail-group">
                  <label>Department Head</label>
                  <p>{formData.head}</p>
                </div>
                <div className="detail-group">
                  <label>Email</label>
                  <p>{formData.email}</p>
                </div>
                <div className="detail-group">
                  <label>Phone</label>
                  <p>{formData.phone}</p>
                </div>
                <div className="detail-group">
                  <label>Established Year</label>
                  <p>{formData.established}</p>
                </div>
                <div className="detail-group">
                  <label>Total Students</label>
                  <p>{formData.students}</p>
                </div>
                <div className="detail-group">
                  <label>Faculty Members</label>
                  <p>{formData.faculty}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label>Department Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div className="form-group">
                  <label>Department Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    required
                    placeholder="e.g. CS101"
                  />
                </div>
                <div className="form-group">
                  <label>Department Head *</label>
                  <input
                    type="text"
                    value={formData.head}
                    onChange={(e) => setFormData({...formData, head: e.target.value})}
                    required
                    placeholder="Full name of department head"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder="department@college.edu"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Established Year</label>
                    <input
                      type="text"
                      value={formData.established}
                      onChange={(e) => setFormData({...formData, established: e.target.value})}
                      placeholder="YYYY"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Total Students</label>
                    <input
                      type="number"
                      value={formData.students}
                      onChange={(e) => setFormData({...formData, students: Number(e.target.value) || 0})}
                      placeholder="Number of students"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Faculty Members</label>
                    <input
                      type="number"
                      value={formData.faculty}
                      onChange={(e) => setFormData({...formData, faculty: Number(e.target.value) || 0})}
                      placeholder="Number of faculty"
                    />
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {modalMode === "add" ? "Add Department" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
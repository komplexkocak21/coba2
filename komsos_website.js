
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toaster, toast } from 'sonner';

export default function Home() {
  const [page, setPage] = useState('welcome');
  const [username, setUsername] = useState('');
  const [group, setGroup] = useState('umum');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');
  const [loggedInUsers, setLoggedInUsers] = useState(0);

  // Ambil data dari localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const storedChats = JSON.parse(localStorage.getItem('chats')) || { umum: [], topo: [], sp3: [], samabusa: [] };
    
    setLoggedInUsers(storedUsers.length);
    setMessages(storedChats[group]);
  }, [group]);

  const handleLogin = () => {
    if (username) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users.push(username);
      localStorage.setItem('users', JSON.stringify(users));
      toast.success(`Welcome, ${username}`);
      setPage('main');
      setLoggedInUsers(users.length);
    }
  };

  const handleSignup = () => {
    if (username) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (!users.includes(username)) {
        users.push(username);
        localStorage.setItem('users', JSON.stringify(users));
        toast.success(`Account created for ${username}`);
        setPage('main');
        setLoggedInUsers(users.length);
      } else {
        toast.error('Username already taken');
      }
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const chatMsg = { user: username, text: message };
    let chats = JSON.parse(localStorage.getItem('chats')) || { umum: [], topo: [], sp3: [], samabusa: [] };
    chats[group].push(chatMsg);

    localStorage.setItem('chats', JSON.stringify(chats));
    setMessages(chats[group]);
    toast.success('Message sent');
    setMessage('');
  };

  const handleLogout = () => {
    setPage('welcome');
    setUsername('');
  };

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem('chats')) || { umum: [], topo: [], sp3: [], samabusa: [] };
    setMessages(storedChats[group]);
  }, [group]);

  if (page === 'welcome') {
    return (
      <div className="p-10 text-center space-y-4">
        <h1 className="text-3xl font-bold">Selamat Datang di Website Komsos</h1>
        <p className="text-lg">Jumlah pengguna yang sudah login: {loggedInUsers}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setPage('login')}>Login</Button>
          <Button onClick={() => setPage('signup')}>Signup</Button>
        </div>
        <Toaster />
      </div>
    );
  }

  if (page === 'login') {
    return (
      <div className="p-10 text-center space-y-4">
        <h2 className="text-2xl font-semibold">Login</h2>
        <Input placeholder="Nama Pengguna" onChange={(e) => setUsername(e.target.value)} />
        <Button onClick={handleLogin}>Masuk</Button>
        <Toaster />
      </div>
    );
  }

  if (page === 'signup') {
    return (
      <div className="p-10 text-center space-y-4">
        <h2 className="text-2xl font-semibold">Signup</h2>
        <Input placeholder="Nama Pengguna" onChange={(e) => setUsername(e.target.value)} />
        <Button onClick={handleSignup}>Daftar</Button>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Selamat Datang, {username}</h2>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <Tabs defaultValue="chatting">
        <TabsList>
          <TabsTrigger value="chatting">Chatting</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>
        <TabsContent value="chatting">
          <div className="my-4">
            <TabsList>
              {['umum', 'topo', 'sp3', 'samabusa'].map(g => (
                <TabsTrigger key={g} value={g} onClick={() => setGroup(g)}>{g}</TabsTrigger>
              ))}
            </TabsList>
            <div className="my-2 max-h-60 overflow-y-auto border p-2 rounded">
              {messages.map((msg, idx) => (
                <p key={idx}><strong>{msg.user}</strong>: {msg.text}</p>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Ketik pesan" value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button onClick={handleSend}>Kirim</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="status">
          <div className="space-y-2">
            <Input placeholder="Status anda" value={status} onChange={(e) => setStatus(e.target.value)} />
            <p>Status saat ini: {status}</p>
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}

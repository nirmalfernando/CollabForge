import React from 'react';

const ChatsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
        <div className="text-xl font-bold">CollabForge</div>
        <div className="flex space-x-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Contact Us</a>
          <a href="#" className="hover:underline">Pricing</a>
        </div>
        <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">L</div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Chat List */}
        <aside className="w-80 border-r border-gray-700 overflow-y-auto">
          <div className="px-6 py-4 text-lg font-semibold">Chats</div>
          <ul>
            {/* Chat Item 1: Jenna Miles */}
            <li className="flex items-start px-6 py-3 hover:bg-gray-800 cursor-pointer">
              <img src="https://via.placeholder.com/40?text=J" alt="Jenna Miles" className="w-10 h-10 rounded-full" />
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">Jenna Miles</span>
                  <span className="text-sm text-gray-400">14:32</span>
                </div>
                <p className="text-sm text-gray-300">Just finished the draft! Want me to send it over?</p>
              </div>
            </li>

            {/* Chat Item 2: Avi Patel (Selected) */}
            <li className="flex items-start px-6 py-3 bg-gray-800 cursor-pointer">
              <img src="https://via.placeholder.com/40?text=A" alt="Avi Patel" className="w-10 h-10 rounded-full" />
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">Avi Patel</span>
                  <span className="text-sm text-gray-400">13:08</span>
                </div>
                <p className="text-sm text-gray-300">Bro 😂 that meeting was way too long.</p>
              </div>
            </li>

            {/* Chat Item 3: Maya Benson */}
            <li className="flex items-start px-6 py-3 hover:bg-gray-800 cursor-pointer">
              <img src="https://via.placeholder.com/40?text=M" alt="Maya Benson" className="w-10 h-10 rounded-full" />
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">Maya Benson</span>
                  <span className="text-sm text-gray-400">16:23</span>
                </div>
                <p className="text-sm text-gray-300">Let&apos;s meet at the cafe near 5th Street?</p>
              </div>
            </li>

            {/* Chat Item 4: Kai Romero */}
            <li className="flex items-start px-6 py-3 hover:bg-gray-800 cursor-pointer">
              <img src="https://via.placeholder.com/40?text=K" alt="Kai Romero" className="w-10 h-10 rounded-full" />
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">Kai Romero</span>
                  <span className="text-sm text-gray-400">20:11</span>
                </div>
                <p className="text-sm text-gray-300">If I open one more file labeled &apos;final_FINAL_v2_REAL_THIS_ONE...&apos;</p>
              </div>
            </li>

            {/* Chat Item 5: Nina Alvi */}
            <li className="flex items-start px-6 py-3 hover:bg-gray-800 cursor-pointer">
              <img src="https://via.placeholder.com/40?text=N" alt="Nina Alvi" className="w-10 h-10 rounded-full" />
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold">Nina Alvi</span>
                  <span className="text-sm text-gray-400">08:15</span>
                </div>
                <p className="text-sm text-gray-300">Let&apos;s touch base after I&apos;ve had a snack and reevaluated every decision I&apos;ve...</p>
              </div>
            </li>
          </ul>
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div className="flex items-center">
              <img src="https://via.placeholder.com/40?text=A" alt="Avi Patel" className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <span className="font-semibold">Avi Patel</span>
                <span className="block text-sm text-green-500">Online</span>
              </div>
            </div>
            <div className="text-gray-400">🔍</div> {/* Search icon placeholder */}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Message from Avi */}
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg px-4 py-2 max-w-md">
                <p>Bro 😂 that meeting was way too long.</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>

            {/* Message from User */}
            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-md">
                <p>So, did you hear about Karen&apos;s &quot;urgent&quot; email? The one about the color of the staplers?</p>
              </div>
            </div>

            {/* Message from Avi */}
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg px-4 py-2 max-w-md">
                <p>Oh please. I live for Karen&apos;s crises. Next week it&apos;ll be &quot;the suspicious angle of the blinds.&quot;</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>

            {/* Message from User */}
            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-md">
                <p>Plot twist: she scheduled a 30-minute meeting to discuss it.</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>

            {/* Message from User */}
            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-md">
                <p>30 minutes?! For staplers?! Did she bring a PowerPoint?</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>

            {/* Message from User */}
            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-md">
                <p>Of course. Slides 1-5: &quot;Stapler colors & their impact on morale.&quot;</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="flex items-center px-6 py-4 border-t border-gray-700">
            <div className="text-gray-400 mr-3">😊</div> {/* Emoji icon placeholder */}
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="text-blue-500 ml-3">➤</div> {/* Send icon placeholder */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatsPage;
"use client";

import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

import { FiSearch } from "react-icons/fi";
import { LuSend } from "react-icons/lu";
import { IoMdAttach } from "react-icons/io";


const ChatsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <Header isLoggedIn={true} userRole="brand-manager" />

      {/* Main Chat Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar - Chat List */}
        <aside className="w-80 border-r border-gray-700 overflow-y-auto">
          <div className="px-6 py-4 text-lg font-semibold border-b border-gray-700">Chats</div>
          <ul>
            {/* Chat Item 1 */}
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

            {/* Chat Item 2 (Selected) */}
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

            {/* Chat Item 3 */}
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

            {/* Chat Item 4 */}
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

            {/* Chat Item 5 */}
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
        <section className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div className="flex items-center">
              <img src="https://via.placeholder.com/40?text=A" alt="Avi Patel" className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <span className="font-semibold">Avi Patel</span>
                <span className="block text-sm text-green-500">Online</span>
              </div>
            </div>
            <FiSearch className="text-gray-100 cursor-pointer" size={20}/>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg px-4 py-2 max-w-md">
                <p>Bro 😂 that meeting was way too long.</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-md">
                <p>So, did you hear about Karen&apos;s &quot;urgent&quot; email? The one about the color of the staplers?</p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg px-4 py-2 max-w-md">
                <p>Oh please. I live for Karen&apos;s crises. Next week it&apos;ll be &quot;the suspicious angle of the blinds.&quot;</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-md">
                <p>Plot twist: she scheduled a 30-minute meeting to discuss it.</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-md">
                <p>30 minutes?! For staplers?! Did she bring a PowerPoint?</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg px-4 py-2 max-w-md">
                <p>Of course. Slides 1-5: &quot;Stapler colors & their impact on morale.&quot;</p>
                <span className="text-xs text-gray-400 mt-1 block text-right">13:08</span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="flex items-center px-6 py-4 border-t border-gray-700">
            <div className="text-gray-400 mr-1 text-[20px]">😊</div>
            <IoMdAttach className="text-blue-500 cursor-pointer mr-2" size={25} />
            
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
            />
            <LuSend className="text-blue-500 ml-3 cursor-pointer" size={25}/>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ChatsPage;

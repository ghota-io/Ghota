import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import GhotaNavbar from '@/Components/GhotaNavbar'
import ActivityBar from '@/Components/ActivityBar'
import Sidebar from '@/Components/Sidebar'
import ChatArea from '@/Components/ChatArea'

export default function ShowChannel({ community, channel, messages }) {
    const { auth } = usePage().props
    const user = auth?.user ?? null
    const isOwner = user?.id === community.owner_id

    const [collapsedCategories, setCollapsedCategories] = useState({})

    const toggleCategory = (categoryId) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }))
    }

    const navigateToChannel = (ch) => {
        router.get(route('communities.channel', [community.slug, ch.name]), {}, {
            preserveState: true,
            preserveScroll: false,
        })
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#1e1f22] overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                <ActivityBar community={community} user={user} />
                <Sidebar
                    community={community}
                    currentChannel={channel}
                    collapsedCategories={collapsedCategories}
                    toggleCategory={toggleCategory}
                    navigateToChannel={navigateToChannel}
                    isOwner={isOwner}
                />

                <main className="flex-1 flex flex-col min-w-0">
                    <ChatArea
                        channel={channel}
                        messages={messages}
                        user={user}
                        community={community}
                    />
                </main>
            </div>
        </div>
    )
}

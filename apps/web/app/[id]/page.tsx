import { redirect } from 'next/navigation';
import EventDetailPage from '../../pages/EventDetailPage';
import { getEventById } from '../../actions/events';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const initialData = await getEventById(id);

    if (!initialData) {
        redirect('/');
    }

    return <EventDetailPage initialData={initialData} recomandations={[]} />;
}
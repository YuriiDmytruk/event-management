import { redirect } from 'next/navigation';
import EditEventPage from "../../../pages/EditEventPage";
import { getEventById } from '../../../actions/events';

export default async function EditEvent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const initialData = await getEventById(id);

    if (!initialData) {
        redirect('/');
    }

    return <EditEventPage initialData={initialData} />;
}
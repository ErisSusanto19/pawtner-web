import { useSelector } from 'react-redux';
import AccountProfileForm from './AccountProfileForm';
import PageLoader from '../../../components/PageLoader';

const AccountProfileTabContent = () => {
    const { user, status } = useSelector((state) => state.auth)

    if (status === 'loading' && !user) {
        return <PageLoader message="Loading Account Details..."/>
    }

    if (!user) {
        return <div className="p-6 text-center text-red-500">Could not load user profile.</div>;
    }

    return <AccountProfileForm initialData={user} />
}

export default AccountProfileTabContent
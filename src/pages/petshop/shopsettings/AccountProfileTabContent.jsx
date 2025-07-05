import { useSelector } from 'react-redux';
import AccountProfileForm from './AccountProfileForm';

const AccountProfileTabContent = () => {
    const { user, status } = useSelector((state) => state.auth)

    if (status === 'loading' && !user) {
        return <div className="p-6 text-center">Loading Account Details...</div>
    }

    return <AccountProfileForm initialData={user} />
}

export default AccountProfileTabContent
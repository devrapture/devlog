import { useGetFollowing } from "@/hooks/query/use-follow"

const FollowingList = () => {
    const { data, isLoading } = useGetFollowing()
    return (
        <div>FollowingList</div>
    )
}

export default FollowingList
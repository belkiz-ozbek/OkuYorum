package aybu.graduationproject.okuyorum.user.service;

import aybu.graduationproject.okuyorum.user.entity.User;
import aybu.graduationproject.okuyorum.user.entity.UserFollowing;
import aybu.graduationproject.okuyorum.user.repository.UserFollowingRepository;
import aybu.graduationproject.okuyorum.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserFollowingService {

    @Autowired
    private UserFollowingRepository userFollowingRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void followUser(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Kullanıcı kendisini takip edemez");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Takip eden kullanıcı bulunamadı"));
        
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("Takip edilecek kullanıcı bulunamadı"));

        if (userFollowingRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new IllegalStateException("Bu kullanıcıyı zaten takip ediyorsunuz");
        }

        UserFollowing userFollowing = new UserFollowing();
        userFollowing.setFollower(follower);
        userFollowing.setFollowing(following);
        userFollowingRepository.save(userFollowing);

        // Takipçi ve takip edilen sayılarını güncelle
        follower.setFollowing(follower.getFollowing() + 1);
        following.setFollowers(following.getFollowers() + 1);
        
        userRepository.save(follower);
        userRepository.save(following);
    }

    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Takip eden kullanıcı bulunamadı"));
        
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("Takip edilen kullanıcı bulunamadı"));

        if (!userFollowingRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new IllegalStateException("Bu kullanıcıyı zaten takip etmiyorsunuz");
        }

        userFollowingRepository.deleteByFollowerAndFollowing(follower, following);

        // Takipçi ve takip edilen sayılarını güncelle
        follower.setFollowing(follower.getFollowing() - 1);
        following.setFollowers(following.getFollowers() - 1);
        
        userRepository.save(follower);
        userRepository.save(following);
    }

    public List<User> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        return userFollowingRepository.findByFollowing(user)
                .stream()
                .map(UserFollowing::getFollower)
                .toList();
    }

    public List<User> getFollowing(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        return userFollowingRepository.findByFollower(user)
                .stream()
                .map(UserFollowing::getFollowing)
                .toList();
    }

    public boolean isFollowing(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Takip eden kullanıcı bulunamadı"));
        
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("Takip edilen kullanıcı bulunamadı"));

        return userFollowingRepository.existsByFollowerAndFollowing(follower, following);
    }
} 
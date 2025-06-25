package ex.hipass.map.repository;

import ex.hipass.map.entity.Box;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoxRepository extends JpaRepository<Box, Long> {
}
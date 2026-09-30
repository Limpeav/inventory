package com.inventory.backend.presentation.api.province;

import com.inventory.backend.presentation.dto.response.ApiResponse;
import com.inventory.backend.presentation.dto.response.ProvinceResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/provinces")
public class ProvinceController {

    private static final List<ProvinceResponse> PROVINCES = List.of(
            ProvinceResponse.builder().code(1).name("Phnom Penh").build(),
            ProvinceResponse.builder().code(2).name("Kandal").build(),
            ProvinceResponse.builder().code(3).name("Siem Reap").build(),
            ProvinceResponse.builder().code(4).name("Battambang").build(),
            ProvinceResponse.builder().code(5).name("Kampong Cham").build(),
            ProvinceResponse.builder().code(6).name("Preah Sihanouk").build(),
            ProvinceResponse.builder().code(7).name("Kampot").build(),
            ProvinceResponse.builder().code(8).name("Takeo").build(),
            ProvinceResponse.builder().code(9).name("Kampong Speu").build(),
            ProvinceResponse.builder().code(10).name("Kampong Thom").build(),
            ProvinceResponse.builder().code(11).name("Kampong Chhnang").build(),
            ProvinceResponse.builder().code(12).name("Banteay Meanchey").build(),
            ProvinceResponse.builder().code(13).name("Prey Veng").build(),
            ProvinceResponse.builder().code(14).name("Svay Rieng").build(),
            ProvinceResponse.builder().code(15).name("Pursat").build(),
            ProvinceResponse.builder().code(16).name("Kratie").build(),
            ProvinceResponse.builder().code(17).name("Stung Treng").build(),
            ProvinceResponse.builder().code(18).name("Ratanakiri").build(),
            ProvinceResponse.builder().code(19).name("Mondulkiri").build(),
            ProvinceResponse.builder().code(20).name("Koh Kong").build(),
            ProvinceResponse.builder().code(21).name("Kep").build(),
            ProvinceResponse.builder().code(22).name("Pailin").build(),
            ProvinceResponse.builder().code(23).name("Oddar Meanchey").build(),
            ProvinceResponse.builder().code(24).name("Preah Vihear").build(),
            ProvinceResponse.builder().code(25).name("Tboung Khmum").build()
    );

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProvinceResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(PROVINCES));
    }
}

package test.spring.escenario1;

import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping
public class testController {

    @Autowired
    private String name;

    @GetMapping
    public testDetailDTO test() {
        return new testDetailDTO();
    }

    @GetMapping
    public List<testDetailDTO> test2() {
        return Arrays.asList(new testDetailDTO(), new testDetailDTO());
    }    
}

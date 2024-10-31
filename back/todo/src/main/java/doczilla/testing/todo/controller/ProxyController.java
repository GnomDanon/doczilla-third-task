package doczilla.testing.todo.controller;

import doczilla.testing.todo.dto.Todo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class ProxyController {

    private final String rootURI = "https://todo.doczilla.pro/api";

    @CrossOrigin
    @GetMapping("/todos")
    public Todo[] todos(@RequestParam(defaultValue = "0") int limit, @RequestParam(defaultValue = "0") int offset) {
        RestTemplate restTemplate = new RestTemplate();
        String requestUri = String.format("%s/todos?limit=%d&offset=%d", rootURI, limit, offset);
        return restTemplate.getForObject(requestUri, Todo[].class);
    }

    @CrossOrigin
    @GetMapping("/todos/date")
    public Todo[] todosDate(@RequestParam long from, @RequestParam long to,
                            @RequestParam(defaultValue = "0") int limit,
                            @RequestParam(defaultValue = "0") int offset) {
        RestTemplate restTemplate = new RestTemplate();
        String requestUri = String.format("%s/todos/date?from=%d&to=%d&limit=%d&offset=%d",
                rootURI, from, to, limit, offset);
        return restTemplate.getForObject(requestUri, Todo[].class);
    }

    @CrossOrigin
    @GetMapping("/todos/dateAndStatus")
    public Todo[] todosDateStatus(@RequestParam long from, @RequestParam long to,
                                  @RequestParam boolean status,
                                  @RequestParam(defaultValue = "0") int limit,
                                  @RequestParam(defaultValue = "0") int offset) {
        RestTemplate restTemplate = new RestTemplate();
        String requestUri = String.format("%s/todos/date?from=%d&to=%d&status=%b&limit=%d&offset=%d",
                rootURI, from, to, status, limit, offset);
        return restTemplate.getForObject(requestUri, Todo[].class);
    }

    @CrossOrigin
    @GetMapping("/todos/find")
    public Todo[] todosFind(@RequestParam String q,
                            @RequestParam(defaultValue = "0") int limit,
                            @RequestParam(defaultValue = "0") int offset) {
        RestTemplate restTemplate = new RestTemplate();
        String requestUri = String.format("%s/todos/find?q=%s&limit=%d&offset=%d",
                rootURI, q, limit, offset);
        return restTemplate.getForObject(requestUri, Todo[].class);
    }

}

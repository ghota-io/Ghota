# Project: Ghota

___
## INSTRUÇÕES PARA AGENTES (LER ANTES DE QUALQUER MENSAGEM):

### USAR A OBSIDIAN VAULT COMO SEGUNDO CÉREBRO (MEMÓRIA PERSISTENTE)

A pasta `.opencode/obsidian/Ghota/` é a **memória persistente** do projecto. Contém documentação estruturada de toda a stack, componentes, fluxos, e decisões.

**REGRAS:**

1. **CONSULTA OBRIGATÓRIA:** No início de cada conversa/sessão, lê `_Index_.md` e as notas relevantes para a tarefa antes de fazeres qualquer alteração ao código. A vault é a tua fonte de verdade sobre como o projecto funciona.

2. **ATUALIZAÇÃO CONTÍNUA:** Sempre que editares código, refletes o que foi alterado na vault:
   - Novos componentes/páginas → adicionar a `Frontend/Componentes.md` ou `Frontend/Paginas.md`
   - Novos controllers/routes/models → atualizar `Backend/`
   - Mudanças de BD → atualizar `BaseDeDados.md` e `Backend/Migrations.md`
   - Decisões de arquitetura → adicionar a `Arquitetura.md` ou "Key Decisions" no resumo da sessão
   - Fluxos novos → adicionar a `Fluxos.md`

3. **ESTRUTURA:** Segue a estrutura existente. Cada nota é focada num tópico. Usa `[[wikilinks]]` para ligar notas relacionadas. Mantém tabelas consistentes.

4. **SINCRONIZAÇÃO:** No final de cada tarefa significativa, atualiza a vault com o que mudou. Se a vault ficar desatualizada, o agente perde contexto.



___